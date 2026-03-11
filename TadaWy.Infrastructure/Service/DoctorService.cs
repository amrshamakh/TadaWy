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

        public DoctorService(TadaWyDbContext context,IWebHostEnvironment env, IImageService imageService)
        {
            _context = context;
            _env = env;
            _imageService = imageService;

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
                    d.Address.State == request.State);
            }
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
                        : d.Street
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
                .Include(d => d.Schedules)
                .Include(d => d.Reviews)
                .Include(d => d.Appointments.Where(a=>a.Date>=DateTime.Today&& a.Date<DateTime.Today.AddDays(3)))
                .FirstOrDefaultAsync(d => d.Id == id && d.Status==DoctorStatus.Approved);

            if (doctor == null)
               throw new NotFoundException("Doctor not found");

            var rating = doctor.Reviews.Any()
                ? doctor.Reviews.Average(r => r.Rating)
                : 0;

            return new DoctorDetailsDto
            {
                Id = doctor.Id,
                Name = doctor.FirstName + " " + doctor.LastName,
                Specialization = doctor.Specialization.Name,
                Address = doctor.Address,
                AddressDescription = doctor.AddressDescription??"",
                PhoneNumber=doctor.PhoneNumber,
                Rating = Math.Round(rating, 1),
                ReviewsCount=doctor.Reviews.Count,
                Price=doctor.Price,
                AvailableDaysSlots = GenerateNextThreeDaysSlots(doctor),
                Reviews = doctor.Reviews
                    .Select(r => new DoctorReviewDto
                    {
                        Rating = r.Rating,
                        Comment = r.Comment
                    }).ToList()
            };
        }


        //helper methods 
        private List<AvailableDaySlotsDto> GenerateNextThreeDaysSlots(Doctor doctor)
        {
            var result = new List<AvailableDaySlotsDto>();

            for (int i = 0; i < 3; i++)
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

        private List<AvailableSlotDto> GenerateAvailableSlotsForDate(Doctor doctor,DateTime date)
        {
            var slots = new List<AvailableSlotDto>();

            var schedule = doctor.Schedules
                .FirstOrDefault(s => s.DayOfWeek == date.DayOfWeek);
            if (schedule == null)
                return slots;
            var start = date.Date + schedule.StartTime;
            var end = date.Date + schedule.EndTime;

            var now = DateTime.Now;
            var bookedAppointments = doctor.Appointments.Where(a => a.Date.Date == date.Date).Select(a => a.Date).ToList();

            while (start < end)
            {
                var slotEnd = start.AddMinutes(20);
                if (start < now)
                {
                    start = slotEnd;
                    continue;
                }
                if (!bookedAppointments.Contains(start))
                {
                    slots.Add(new AvailableSlotDto
                    {
                        StartTime = start,
                        EndTime = slotEnd
                    });
                }

                start = slotEnd;
            }

            return slots;
        }

        public async Task<DoctorProfileDto> GetDoctorProfileAsync(string userId)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Specialization)
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new NotFoundException("User not found");

            return new DoctorProfileDto
            {
                Id = doctor.Id,
                FirstName = doctor.FirstName,
                LastName = doctor.LastName,
                Email = user.Email ?? "",
                Specialization = doctor.Specialization.Name,
                Address = doctor.Address.ToString(),
                AddressDescription = doctor.AddressDescription??"",
                PhoneNumber = doctor.PhoneNumber,
                Bio = doctor.Bio,
                Price = doctor.Price,
                ImageUrl = doctor.ImageUrl
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
            doctor.FirstName = updateDto.FirstName??doctor.FirstName;
            doctor.LastName = updateDto.LastName ?? doctor.LastName;
            doctor.PhoneNumber = updateDto.PhoneNumber ?? doctor.PhoneNumber;
            doctor.Bio = updateDto.Bio;
            doctor.Price = updateDto.Price;
            doctor.AddressDescription = updateDto.AddressDescription;
            await _context.SaveChangesAsync();
            
        }

        public async Task<string> UploadDoctorImageAsync(string userId, IFormFile image)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserID == userId);

            if (doctor == null)
                throw new NotFoundException("Doctor not found");

            // Delete old image if exists
            if (!string.IsNullOrEmpty(doctor.ImageUrl))
            {
                await _imageService.DeleteDoctorImageAsync(doctor.ImageUrl);
            }

            var imageUrl = await _imageService.SaveDoctorImageAsync(image, doctor.Id);

            doctor.ImageUrl = imageUrl;

            await _context.SaveChangesAsync();

            return doctor.ImageUrl;
        }




    }
}
