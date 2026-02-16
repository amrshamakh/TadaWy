using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.Common;
using TadaWy.Applicaation.DTO.DoctorDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class DoctorService : IDoctorService
    {
        private readonly TadaWyDbContext _context;

        public DoctorService(TadaWyDbContext context)
        {
            _context = context;
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
                return null;

            var rating = doctor.Reviews.Any()
                ? doctor.Reviews.Average(r => r.Rating)
                : 0;

            return new DoctorDetailsDto
            {
                Id = doctor.Id,
                Name = doctor.FirstName + " " + doctor.LastName,
                Specialization = doctor.Specialization.Name,
                Address = doctor.Address.ToString(),
                AddressDescription = doctor.AddressDescription??"",
                Rating = Math.Round(rating, 1),
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
    }
}
