using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.Common;
using TadaWy.Applicaation.DTO.DoctorDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Enums;
using TadaWy.Domain.Exceptions;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class DoctorService : IDoctorService
    {
        private readonly TadaWyDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IImageService _imageService;
        private readonly INotificationService _notificationService;
        private readonly IHttpClientFactory _httpClientFactory;

        public DoctorService(TadaWyDbContext context, IWebHostEnvironment env, IImageService imageService, INotificationService notificationService, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _env = env;
            _imageService = imageService;
            _notificationService = notificationService;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<PagedResult<DoctorListDto>> GetDoctorsAsync(GetDoctorsRequest request)
        {
            var query = _context.Doctors.AsNoTracking().Where(d => d.Status == Domain.Enums.DoctorStatus.Approved);
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(d =>
                    (d.FirstName + " " + d.LastName)
                    .ToLower()
                    .Contains(request.Search.ToLower()));
            }
            if (request.SpecializationId.HasValue)
            {
                query = query.Where(d =>
                    d.SpecializationId == request.SpecializationId.Value);
            }
            if (!string.IsNullOrWhiteSpace(request.State))
            {
                query = query.Where(d =>
                    d.Address.State == request.State);         }
            if (!string.IsNullOrWhiteSpace(request.City))
            {
                query = query.Where(d =>
                    d.Address.City == request.City);
            }

            var projected = query.Select(d => new
            {
                d.Id,
                d.FirstName,
                d.LastName,
                d.ImageUrl,
                SpecializationName = d.Specialization.Name,
                d.Address.City,
                d.Address.Street,
                d.AddressDescription,
                Rating = d.Reviews.Any()
                    ? d.Reviews.Average(r => r.Rating) : 0
            });
            if (request.MinRating.HasValue)
            {
                projected = projected.Where(d =>
                    d.Rating >= request.MinRating.Value);
            }
            projected = projected.OrderByDescending(d => d.Rating);

            var totalCount = await projected.CountAsync();

            var doctors = await projected
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(d => new DoctorListDto
                {
                    Id = d.Id,
                    DoctorName = d.FirstName + " " + d.LastName,
                    Rate = Math.Round(d.Rating, 1),
                    Specialization = d.SpecializationName,
                    City = d.City,
                    Street = d.Street == "Unknown"
                        ? d.AddressDescription
                        : d.Street,
                    ImageUrl = d.ImageUrl
                })
                .ToListAsync();

            return new PagedResult<DoctorListDto>
            {
                Items = doctors,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task<DoctorDetailsDto?> GetDoctorByIdAsync(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Schedules).ThenInclude(s => s.TimeSlots)
                .Include(d => d.Reviews).ThenInclude(r => r.Patient)
                .Include(d => d.Appointments.Where(a => a.Date >= DateTime.Today && a.Date < DateTime.Today.AddDays(7)))
                .FirstOrDefaultAsync(d => d.Id == id && d.Status == DoctorStatus.Approved);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            var yearsOfExperience = 0;
            if (doctor.CareerStartDate.HasValue)
            {
                yearsOfExperience = DateTime.Today.Year - doctor.CareerStartDate.Value.Year;
                if (doctor.CareerStartDate.Value.Date > DateTime.Today.AddYears(-yearsOfExperience)) yearsOfExperience--;
            }

            return new DoctorDetailsDto
            {
                Id = doctor.Id,
                Name = doctor.FirstName + " " + doctor.LastName,
                Specialization = doctor.Specialization.Name,
                Address = doctor.Address,
                AddressDescription = doctor.AddressDescription ?? "",
                PhoneNumber = doctor.PhoneNumber,
                Rating = Math.Round(doctor.Rating, 1),
                YearsOfExperience = yearsOfExperience,
                ReviewsCount = doctor.Reviews.Count,
                Price = doctor.Price,
                About=doctor.Bio,
                ImageUrl = doctor.ImageUrl,

                AvailableDaysSlots = GenerateNextSevenDaysSlots(doctor),
                Reviews = doctor.Reviews
                    .Select(r => new DoctorReviewDto
                    {
                        Id = r.Id,
                        PatientName = $"{r.Patient.FirstName} {r.Patient.LastName}",
                        Rating = r.Rating,
                        Comment = r.Comment
                    }).ToList()
            };
        }

        private List<AvailableDaySlotsDto> GenerateNextSevenDaysSlots(Doctor doctor)
        {
            var result = new List<AvailableDaySlotsDto>();

            for (int i = 0; i < 7; i++)
            {
                var date = DateTime.Today.AddDays(i);
                var daySlots = GenerateAvailableSlotsForDate(doctor, date);

                if (daySlots.Any())
                {
                    result.Add(new AvailableDaySlotsDto
                    {
                        Date = date,
                        Slots = daySlots
                    });
                }
            }

            return result;
        }

        private List<AvailableSlotDto> GenerateAvailableSlotsForDate(Doctor doctor, DateTime date)
        {
            var slots = new List<AvailableSlotDto>();

            var schedule = doctor.Schedules
                .FirstOrDefault(s => s.DayOfWeek == date.DayOfWeek && s.IsWorkingDay);
            
            if (schedule == null || !schedule.TimeSlots.Any())
                return slots;

            var now = DateTime.Now;
            var bookedAppointments = doctor.Appointments
                .Where(a => a.Date.Date == date.Date)
                .Select(a => a.Date)
                .ToList();

            int duration = doctor.AppointmentDurationMinutes ?? 20;

            foreach (var timeSlot in schedule.TimeSlots)
            {
                var start = date.Date + timeSlot.StartTime;
                var end = date.Date + timeSlot.EndTime;

                while (start.AddMinutes(duration) <= end)
                {
                    var slotEnd = start.AddMinutes(duration);
                    if (start >= now && !bookedAppointments.Any(b => b >= start && b < slotEnd))
                    {
                        slots.Add(new AvailableSlotDto
                        {
                            StartTime = start,
                            EndTime = slotEnd
                        });
                    }
                    start = slotEnd;
                }
            }

            return slots;
        }

        public async Task<DoctorProfileDto> GetDoctorProfileAsync(string userId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Specialization)
                .Include(d => d.Reviews)
                    .ThenInclude(r => r.Patient)
                .Include(d => d.Appointments)
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new NotFoundException("User not found");

            var yearsOfExperience = 0;
            if (doctor.CareerStartDate.HasValue)
            {
                yearsOfExperience = DateTime.Now.Year - doctor.CareerStartDate.Value.Year;
                if (DateTime.Now < doctor.CareerStartDate.Value.AddYears(yearsOfExperience))
                    yearsOfExperience--;
            }

            return new DoctorProfileDto
            {
                Id = doctor.Id,
                FirstName = doctor.FirstName,
                LastName = doctor.LastName,
                Email = user.Email ?? "",
                Specialization = doctor.Specialization.Name,
                Address = doctor.Address,
                AddressDescription = doctor.AddressDescription ?? "",
                PhoneNumber = doctor.PhoneNumber,
                Bio = doctor.Bio,
                Price = doctor.Price,
                ImageUrl = doctor.ImageUrl,
                Rating = Math.Round(doctor.Rating, 1),
                ReviewsCount = doctor.Reviews.Count,
                PatientsCount = doctor.Appointments.Select(a => a.PatientId).Distinct().Count(),
                YearsOfExperience = yearsOfExperience,
                Reviews = doctor.Reviews.Select(r => new DoctorReviewDto
                {
                    Id = r.Id,
                    PatientName = $"{r.Patient.FirstName} {r.Patient.LastName}",
                    Rating = r.Rating,
                    Comment = r.Comment
                }).ToList()
            };
        }

        public async Task UpdateDoctorProfileAsync(string userId, UpdateDoctorProfileDto updateDto)
        {
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserID == userId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new NotFoundException("User not found");
            user.PhoneNumber = updateDto.PhoneNumber;
            if (doctor == null) throw new NotFoundException("Doctor Not Found");
            doctor.FirstName = updateDto.FirstName ?? doctor.FirstName;
            doctor.LastName = updateDto.LastName ?? doctor.LastName;
            doctor.PhoneNumber = updateDto.PhoneNumber ?? doctor.PhoneNumber;
            doctor.Bio = updateDto.Bio;
            doctor.Price = updateDto.Price;
            doctor.CareerStartDate = updateDto.CareerStartDate;
            doctor.AddressDescription = updateDto.AddressDescription;
            await _context.SaveChangesAsync();
        }

        public async Task<string> UploadDoctorImageAsync(string userId, IFormFile image)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            if (!string.IsNullOrEmpty(doctor.ImageUrl))
            {
                await _imageService.DeleteDoctorImageAsync(doctor.ImageUrl);
            }

            var imageUrl = await _imageService.SaveDoctorImageAsync(image, doctor.Id);
            doctor.ImageUrl = imageUrl;
            await _context.SaveChangesAsync();

            return doctor.ImageUrl;
        }

        public async Task<(Stream Stream, string ContentType)> GetDoctorImageAsync(int id, string? size = null)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            var imageUrl = doctor?.ImageUrl;

            if (string.IsNullOrEmpty(imageUrl))
            {
                throw new NotFoundException("Doctor image not found");
            }

            // Optional: Apply Cloudinary transformations if size is specified
            if (!string.IsNullOrEmpty(size))
            {
                // Cloudinary transformation format: .../upload/w_200,h_200,c_fill/v12345/...
                // Basic implementation: insert transformation after '/upload/'
                var uploadPart = "/upload/";
                var uploadIndex = imageUrl.IndexOf(uploadPart);
                if (uploadIndex != -1)
                {
                    var transformation = size.ToLower() switch
                    {
                        "small" => "w_150,h_150,c_fill/",
                        "medium" => "w_300,h_300,c_fill/",
                        "large" => "w_600,h_600,c_fill/",
                        _ => ""
                    };
                    imageUrl = imageUrl.Insert(uploadIndex + uploadPart.Length, transformation);
                }
            }

            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync(imageUrl);
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Unable to retrieve doctor image");
            }

            var stream = await response.Content.ReadAsStreamAsync();
            var contentType = response.Content.Headers.ContentType?.ToString() ?? "image/jpeg";
            
            return (stream, contentType);
        }

        public async Task<DoctorScheduleDto> GetDoctorScheduleAsync(string userId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Schedules).ThenInclude(s => s.TimeSlots)
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            var result = new DoctorScheduleDto
            {
                AppointmentDurationMinutes = doctor.AppointmentDurationMinutes ?? 20,
                AppointmentPrice = doctor.Price ?? 0,
                WeeklyAvailability = new List<WeeklyAvailabilityDto>()
            };

            foreach (DayOfWeek day in Enum.GetValues(typeof(DayOfWeek)))
            {
                var schedule = doctor.Schedules.FirstOrDefault(s => s.DayOfWeek == day);
                result.WeeklyAvailability.Add(new WeeklyAvailabilityDto
                {
                    DayOfWeek = day,
                    IsWorkingDay = schedule?.IsWorkingDay ?? false,
                    TimeSlots = schedule?.TimeSlots.Select(ts => new TimeSlotDto
                    {
                        StartTime = ts.StartTime,
                        EndTime = ts.EndTime
                    }).ToList() ?? new List<TimeSlotDto>()
                });
            }

            return result;
        }

        public async Task UpdateDoctorScheduleAsync(string userId, UpdateDoctorScheduleDto dto)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Schedules).ThenInclude(s => s.TimeSlots)
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            doctor.AppointmentDurationMinutes = dto.AppointmentDurationMinutes;
            doctor.Price = dto.AppointmentPrice;

            // Simple approach: remove and recreate
            _context.DoctorSchedules.RemoveRange(doctor.Schedules);

            foreach (var avail in dto.WeeklyAvailability)
            {
                var schedule = new DoctorSchedule
                {
                    DoctorId = doctor.Id,
                    DayOfWeek = avail.DayOfWeek,
                    IsWorkingDay = avail.IsWorkingDay,
                    TimeSlots = avail.TimeSlots.Select(ts => new DoctorTimeSlot
                    {
                        StartTime = ts.StartTime,
                        EndTime = ts.EndTime
                    }).ToList()
                };
                _context.DoctorSchedules.Add(schedule);
            }

            await _context.SaveChangesAsync();
        }

        public async Task AddTimeSlotAsync(string userId, AddDoctorTimeSlotDto dto)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Schedules)
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            var schedule = doctor.Schedules.FirstOrDefault(s => s.DayOfWeek == dto.DayOfWeek);

            if (schedule == null)
            {
                schedule = new DoctorSchedule
                {
                    DoctorId = doctor.Id,
                    DayOfWeek = dto.DayOfWeek,
                    IsWorkingDay = true
                };
                _context.DoctorSchedules.Add(schedule);
            }
            else
            {
                schedule.IsWorkingDay = true;
            }

            var slot = new DoctorTimeSlot
            {
                DoctorSchedule = schedule,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            _context.DoctorTimeSlots.Add(slot);
            await _context.SaveChangesAsync();
        }

        public async Task<DoctorScheduleSummaryDto> GetDoctorWeeklySummaryAsync(string userId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Schedules).ThenInclude(s => s.TimeSlots)
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            int workingDays = doctor.Schedules.Count(s => s.IsWorkingDay);
            int totalSlots = 0;
            int duration = doctor.AppointmentDurationMinutes ?? 20;

            foreach (var schedule in doctor.Schedules.Where(s => s.IsWorkingDay))
            {
                foreach (var ts in schedule.TimeSlots)
                {
                    var diff = ts.EndTime - ts.StartTime;
                    totalSlots += (int)(diff.TotalMinutes / duration);
                }
            }

            return new DoctorScheduleSummaryDto
            {
                WorkingDaysCount = workingDays,
                TotalAppointmentsPerWeek = totalSlots,
                AppointmentDurationMinutes = duration,
                AppointmentPrice = doctor.Price ?? 0
            };
        }

        public async Task<bool> CancelAppointmentAsync(int appointmentId, string userId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.Doctor.UserID == userId);

            if (appointment == null)
                throw new NotFoundException("Appointment not found or you don't have permission to cancel it.");

            if (appointment.Status == AppointmentStatus.Cancelled)
                return false;

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();

            // Notify Doctor
            await _notificationService.SendNotificationAsync(userId, "Appointment Cancelled", $"You have cancelled the appointment on {appointment.Date:f}.", NotificationType.AppointmentCancelled, appointment.Id);

            // Notify Patient
            await _notificationService.SendNotificationAsync(appointment.PatientId, "Appointment Cancelled by Doctor", $"Dr. {appointment.Doctor.FirstName} {appointment.Doctor.LastName} has cancelled your appointment on {appointment.Date:f}.", NotificationType.AppointmentCancelled, appointment.Id);

            return true;
        }

        public async Task<bool> ConfirmAppointmentAsync(int appointmentId, string userId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.Doctor.UserID == userId);

            if (appointment == null)
                throw new NotFoundException("Appointment not found or you don't have permission to confirm it.");

            if (appointment.Status != AppointmentStatus.Pending)
                return false;

            appointment.Status = AppointmentStatus.Confirmed;
            await _context.SaveChangesAsync();

            // Notify Patient
            await _notificationService.SendNotificationAsync(
                appointment.PatientId,
                "Appointment Confirmed",
                $"Dr. {appointment.Doctor.FirstName} {appointment.Doctor.LastName} has confirmed your appointment on {appointment.Date:f}.",
                NotificationType.AppointmentBooked, // Using Booked type for positive confirmation
                appointment.Id);

            return true;
        }
    }
}

