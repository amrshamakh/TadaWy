using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
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
        private readonly IPaymentService _paymentService;


        public DoctorService(TadaWyDbContext context, IWebHostEnvironment env, IImageService imageService, INotificationService notificationService, IHttpClientFactory httpClientFactory, IPaymentService paymentService)
        {
            _context = context;
            _env = env;
            _imageService = imageService;
            _notificationService = notificationService;
            _httpClientFactory = httpClientFactory;
            _paymentService = paymentService;
        }

        public async Task<PagedResult<DoctorListDto>> GetDoctorsAsync(GetDoctorsRequest request)
        {
            var query = _context.Doctors.AsNoTracking().Where(d => d.Status == Domain.Enums.DoctorStatus.Approved);
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                query = query.Where(d =>
                    (d.FirstNameEn + " " + d.LastNameEn + " " + d.FirstNameAr + " " + d.LastNameAr)
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
                d.UserID,
                d.FirstNameEn,
                d.FirstNameAr,
                d.LastNameEn,
                d.LastNameAr,
                d.ImageUrl,
                SpecializationNameEn = d.Specialization.NameEn,
                SpecializationNameAr = d.Specialization.NameAr,
                d.Address.City,
                d.Address.CityAr,
                d.Address.Street,
                d.Address.StreetAr,
                d.AddressDescriptionEn,
                d.AddressDescriptionAr,
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
                    UserId = d.UserID,
                    DoctorName = CultureInfo.CurrentUICulture.Name.StartsWith("ar") 
                        ? d.FirstNameAr + " " + d.LastNameAr 
                        : d.FirstNameEn + " " + d.LastNameEn,
                    Rate = Math.Round(d.Rating, 1),
                    Specialization = CultureInfo.CurrentUICulture.Name.StartsWith("ar") 
                        ? d.SpecializationNameAr 
                        : d.SpecializationNameEn,
                    City = CultureInfo.CurrentUICulture.Name.StartsWith("ar") ? d.CityAr : d.City,
                    Street = d.Street == "Unknown"
                        ? (CultureInfo.CurrentUICulture.Name.StartsWith("ar") ? d.AddressDescriptionAr : d.AddressDescriptionEn)
                        : (CultureInfo.CurrentUICulture.Name.StartsWith("ar") ? d.StreetAr : d.Street),
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
                .AsNoTracking()
                .Include(d => d.Specialization)
                .Include(d => d.Schedules).ThenInclude(s => s.TimeSlots)
                .Include(d => d.Appointments.Where(a => a.Date >= DateTime.Today && a.Date < DateTime.Today.AddDays(7)))
                .FirstOrDefaultAsync(d => d.Id == id && d.Status == DoctorStatus.Approved);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            // Load reviews count server-side, only fetch latest 20 reviews
            var reviewsCount = await _context.DoctorReviews
                .CountAsync(r => r.DoctorId == id);

            var latestReviews = await _context.DoctorReviews
                .AsNoTracking()
                .Where(r => r.DoctorId == id)
                .OrderByDescending(r => r.Id)
                .Take(20)
                .Include(r => r.Patient)
                .Select(r => new DoctorReviewDto
                {
                    Id = r.Id,
                    PatientName = $"{r.Patient.FirstName} {r.Patient.LastName}",
                    Rating = r.Rating,
                    Comment = r.Comment
                })
                .ToListAsync();

            var yearsOfExperience = 0;
            if (doctor.CareerStartDate.HasValue)
            {
                yearsOfExperience = DateTime.Today.Year - doctor.CareerStartDate.Value.Year;
                if (doctor.CareerStartDate.Value.Date > DateTime.Today.AddYears(-yearsOfExperience)) yearsOfExperience--;
            }

            return new DoctorDetailsDto
            {
                Id = doctor.Id,
                NameEn = doctor.FirstNameEn + " " + doctor.LastNameEn,
                NameAr = doctor.FirstNameAr + " " + doctor.LastNameAr,
                SpecializationEn = doctor.Specialization.NameEn,
                SpecializationAr = doctor.Specialization.NameAr,
                Address = doctor.Address,
                AddressDescriptionEn = doctor.AddressDescriptionEn ?? "",
                AddressDescriptionAr = doctor.AddressDescriptionAr ?? "",
                PhoneNumber = doctor.PhoneNumber,
                Rating = Math.Round(doctor.Rating, 1),
                YearsOfExperience = yearsOfExperience,
                ReviewsCount = reviewsCount,
                Price = doctor.Price,
                AboutEn = doctor.BioEn,
                AboutAr = doctor.BioAr,
                ImageUrl = doctor.ImageUrl,

                AvailableDaysSlots = GenerateNextSevenDaysSlots(doctor),
                Reviews = latestReviews
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
                .AsNoTracking()
                .Include(d => d.Specialization)
                .Include(d => d.Reviews)
                    .ThenInclude(r => r.Patient)
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new NotFoundException("User not found");

            // Server-side count instead of loading ALL appointments
            var patientsCount = await _context.Appointments
                .Where(a => a.DoctorId == doctor.Id)
                .Select(a => a.PatientId)
                .Distinct()
                .CountAsync();

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
                FirstNameEn = doctor.FirstNameEn,
                FirstNameAr = doctor.FirstNameAr,
                LastNameEn = doctor.LastNameEn,
                LastNameAr = doctor.LastNameAr,
                Email = user.Email ?? "",
                SpecializationEn = doctor.Specialization.NameEn,
                SpecializationAr = doctor.Specialization.NameAr,
                Address = doctor.Address,
                AddressDescriptionEn = doctor.AddressDescriptionEn ?? "",
                AddressDescriptionAr = doctor.AddressDescriptionAr ?? "",
                PhoneNumber = doctor.PhoneNumber,
                BioEn = doctor.BioEn,
                BioAr = doctor.BioAr,
                Price = doctor.Price,
                ImageUrl = doctor.ImageUrl,
                Rating = Math.Round(doctor.Rating, 1),
                ReviewsCount = doctor.Reviews.Count,
                PatientsCount = patientsCount,
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
            doctor.FirstNameEn = updateDto.FirstNameEn ?? doctor.FirstNameEn;
            doctor.FirstNameAr = updateDto.FirstNameAr ?? doctor.FirstNameAr;
            doctor.LastNameEn = updateDto.LastNameEn ?? doctor.LastNameEn;
            doctor.LastNameAr = updateDto.LastNameAr ?? doctor.LastNameAr;
            doctor.PhoneNumber = updateDto.PhoneNumber ?? doctor.PhoneNumber;
            doctor.BioEn = updateDto.BioEn ?? doctor.BioEn;
            doctor.BioAr = updateDto.BioAr ?? doctor.BioAr;
            doctor.Price = updateDto.Price ?? doctor.Price;
            doctor.CareerStartDate = updateDto.CareerStartDate ?? doctor.CareerStartDate;
            doctor.AddressDescriptionEn = updateDto.AddressDescriptionEn ?? doctor.AddressDescriptionEn;
            doctor.AddressDescriptionAr = updateDto.AddressDescriptionAr ?? doctor.AddressDescriptionAr;
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
            if (appointment.Date <= DateTime.Now)
                return false;

            if (appointment.Payment != null &&
                appointment.Payment.Method == PaymentMethod.Online &&
                appointment.Payment.Amount > 0 &&
                appointment.Payment.Status == PaymentStatus.Paid)
            {
                var refundSucceeded = await _paymentService.RefundAsync(appointment.Payment.Id);

                if (!refundSucceeded)
                {
                    return false;
                }
            }

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();

            // Notify Doctor
            await _notificationService.SendNotificationAsync(userId, "Appointment Cancelled", "إلغاء الموعد", $"You have cancelled the appointment on {appointment.Date:f}.", $"لقد قمت بإلغاء الموعد في {appointment.Date:f}.", NotificationType.AppointmentCancelled, appointment.Id);

            // Notify Patient
            await _notificationService.SendNotificationAsync(
                appointment.PatientId, 
                "Appointment Cancelled by Doctor", 
                "إلغاء الموعد من قبل الطبيب", 
                $"Dr. {appointment.Doctor.FirstNameEn} {appointment.Doctor.LastNameEn} has cancelled your appointment on {appointment.Date:f}.", 
                $"لقد قام دكتور {appointment.Doctor.FirstNameAr} {appointment.Doctor.LastNameAr} بإلغاء موعدك في {appointment.Date:f}.", 
                NotificationType.AppointmentCancelled, 
                appointment.Id);

            return true;
        }

        public async Task<DoctorAppointmentsDto> GetDoctorAppointmentsAsync(string userId, GetDoctorAppointmentsRequest request)
        {
            var doctor = await _context.Doctors.AsNoTracking().FirstOrDefaultAsync(d => d.UserID == userId);
            if (doctor == null) throw new NotFoundException("Doctor not found");

            var query = _context.Appointments
                .AsNoTracking()
                .Include(a => a.Payment)
                .Where(a => a.DoctorId == doctor.Id);

            // Apply filters
            if (request.Day.HasValue)
            {
                var targetDate = request.Day.Value.Date;
                query = query.Where(a => a.Date.Date == targetDate);
            }

            if (request.PaymentMethod.HasValue)
            {
                query = query.Where(a => a.Payment != null && a.Payment.Method == request.PaymentMethod.Value);
            }

            var appointments = await query.OrderBy(a => a.Date).ToListAsync();

            // Batch: load all patients in one query with dictionary for O(1) lookup
            var userIds = appointments.Select(a => a.PatientId).Distinct().ToList();
            var patientsDict = await _context.Patients
                .AsNoTracking()
                .Where(p => userIds.Contains(p.UserID))
                .ToDictionaryAsync(p => p.UserID);

            // Batch: load user phone numbers in one query
            var usersDict = await _context.Users
                .AsNoTracking()
                .Where(u => userIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id, u => u.PhoneNumber);

            var appointmentList = appointments.Select(a =>
            {
                patientsDict.TryGetValue(a.PatientId, out var patient);
                usersDict.TryGetValue(a.PatientId, out var phone);
                return new AppointmentListItemDto
                {
                    Id = a.Id,
                    PatientId = patient?.Id ?? 0,
                    PatientName = patient != null ? $"{patient.FirstName} {patient.LastName}" : "Unknown",
                    PatientPhone = phone ?? "N/A",
                    PaymentMethod = a.Payment?.Method ?? PaymentMethod.Offline,
                    DurationMinutes = doctor.AppointmentDurationMinutes ?? 20,
                    AppointmentDate = a.Date,
                    Status = a.Status
                };
            }).ToList();

            return new DoctorAppointmentsDto
            {
                TotalAppointments = appointmentList.Count,
                ConfirmedCount = appointmentList.Count(a => a.Status == AppointmentStatus.Completed),
                PendingCount = appointmentList.Count(a => a.Status == AppointmentStatus.Upcoming),
                CancelledCount = appointmentList.Count(a => a.Status == AppointmentStatus.Cancelled),
                Appointments = appointmentList
            };
        }

        public async Task<bool> ConfirmAppointmentAsync(int appointmentId, string userId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Payment)
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.Doctor.UserID == userId);

            if (appointment == null)
                throw new NotFoundException("Appointment not found or you don't have permission to confirm it.");

            if (appointment.Status != AppointmentStatus.Upcoming)
                return false;

            appointment.Status = AppointmentStatus.Completed;

            // Update payment status if offline
            if (appointment.Payment != null && appointment.Payment.Method == PaymentMethod.Offline)
            {
                appointment.Payment.Status = PaymentStatus.Paid;
                appointment.Payment.PaymentDate = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            // Notify Patient
            await _notificationService.SendNotificationAsync(
                appointment.PatientId,
                "Appointment Confirmed",
                "تأكيد الموعد",
                $"Dr. {appointment.Doctor.FirstNameEn} {appointment.Doctor.LastNameEn} has confirmed your appointment on {appointment.Date:f}.",
                $"لقد قام دكتور {appointment.Doctor.FirstNameAr} {appointment.Doctor.LastNameAr} بتأكيد موعدك في {appointment.Date:f}.",
                NotificationType.AppointmentBooked, // Using Booked type for positive confirmation
                appointment.Id);

            return true;
        }
    }
}

