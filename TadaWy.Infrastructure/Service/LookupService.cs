using Microsoft.EntityFrameworkCore;
using System.Globalization;
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
            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");
            return await _context.ChronicDiseases
                .Select(cd => new ChronicDiseaseDto
                {
                    Id = cd.Id,
                    Name = isArabic ? cd.NameAr : cd.NameEn
                }).ToListAsync();
        }

        public async Task AddChronicDiseaseAsync(string nameEn, string nameAr)
        {
            _context.ChronicDiseases.Add(new ChronicDisease { NameEn = nameEn, NameAr = nameAr });
            await _context.SaveChangesAsync();
        }

        public async Task<List<SpecializationDto>> GetSpecializationsAsync()
        {
            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");
            return await _context.Specializations
                .Select(s => new SpecializationDto
                {
                    Id = s.Id,
                    Name = isArabic ? s.NameAr : s.NameEn
                }).ToListAsync();
        }

        public async Task AddSpecializationAsync(string nameEn, string nameAr)
        {
            _context.Specializations.Add(new Specialization { NameEn = nameEn, NameAr = nameAr });
            await _context.SaveChangesAsync();
        }

        public async Task<List<AllergyDto>> GetAllergiesAsync()
        {
            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");
            return await _context.Allergies
                .Select(a => new AllergyDto
                {
                    Id = a.Id,
                    Name = isArabic ? a.NameAr : a.NameEn
                }).ToListAsync();
        }

        public async Task AddAllergyAsync(string nameEn, string nameAr)
        {
            _context.Allergies.Add(new Allergy { NameEn = nameEn, NameAr = nameAr });
            await _context.SaveChangesAsync();
        }

        public async Task<List<StateDto>> GetStatesAsync()
        {
            return await _context.States
                .Select(s => new StateDto
                {
                    Id = s.Id,
                    NameEn = s.NameEn,
                    NameAr = s.NameAr
                }).ToListAsync();
        }

        public async Task<List<CityDto>> GetCitiesByStateAsync(int stateId)
        {
            return await _context.Cities
                .Where(c => c.StateId == stateId)
                .Select(c => new CityDto
                {
                    Id = c.Id,
                    NameEn = c.NameEn,
                    NameAr = c.NameAr,
                    StateId = c.StateId
                }).ToListAsync();
        }
    }
}
