using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.Common;
using TadaWy.Applicaation.DTO.DoctorDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class DoctorService: IDoctorService
    {
        private readonly TadaWyDbContext _context;

        public DoctorService(TadaWyDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<DoctorListDto>> GetDoctorsAsync(GetDoctorsRequest request)
        {
            var query = _context.Doctors.AsNoTracking().Where(d=>d.IsApproved);
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
                    ? d.Reviews.Average(r => r.Rating): 0 
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
                    Street = d.Street== "Unknown"
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
    }
}
