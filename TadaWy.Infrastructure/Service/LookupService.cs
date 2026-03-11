using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.LookUpDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
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

        public async Task AddChronicDiseaseAsync(string name)
        {
            _context.ChronicDiseases.Add(new ChronicDisease { Name = name });
            await _context.SaveChangesAsync();
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

        public async Task AddSpecializationAsync(string name)
        {
            _context.Specializations.Add(new Specialization { Name = name });
            await _context.SaveChangesAsync();
        }

        public async Task<List<AllergyDto>> GetAllergiesAsync()
        {
            return await _context.Allergies
                .Select(a => new AllergyDto
                {
                    Id = a.Id,
                    Name = a.Name
                }).ToListAsync();
        }

        public async Task AddAllergyAsync(string name)
        {
            _context.Allergies.Add(new Allergy { Name = name });
            await _context.SaveChangesAsync();
        }
    }
}
