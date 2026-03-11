using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.LookUpDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class LookupService : ILookupService
    {
        private readonly TadaWyDbContext _context;

        public LookupService(TadaWyDbContext context)
        {
            _context = context;
        }

        public async Task<List<ChronicDiseaseDto>> GetChronicDiseasesAsync()
        {
            return await _context.ChronicDiseases
                .Select(cd => new ChronicDiseaseDto
                {
                    Id = cd.Id,
                    Name = cd.Name
                }).ToListAsync();
        }

        public async Task<List<SpecializationDto>> GetSpecializationsAsync()
        {
            return await _context.Specializations
                .Select(s => new SpecializationDto
                {
                    Id = s.Id,
                    Name = s.Name
                }).ToListAsync();
        }
    }
}
