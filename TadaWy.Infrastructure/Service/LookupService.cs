using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
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
        private readonly IMemoryCache _cache;
        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);

        public LookupService(TadaWyDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public async Task<List<ChronicDiseaseDto>> GetChronicDiseasesAsync()
        {
            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");
            var cacheKey = $"chronic_diseases_{(isArabic ? "ar" : "en")}";

            return await _cache.GetOrCreateAsync(cacheKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = CacheDuration;
                return await _context.ChronicDiseases
                    .AsNoTracking()
                    .Select(cd => new ChronicDiseaseDto
                    {
                        Id = cd.Id,
                        Name = isArabic ? cd.NameAr : cd.NameEn
                    }).ToListAsync();
            }) ?? new List<ChronicDiseaseDto>();
        }

        public async Task AddChronicDiseaseAsync(string nameEn, string nameAr)
        {
            _context.ChronicDiseases.Add(new ChronicDisease { NameEn = nameEn, NameAr = nameAr });
            await _context.SaveChangesAsync();
            _cache.Remove("chronic_diseases_ar");
            _cache.Remove("chronic_diseases_en");
        }

        public async Task<List<SpecializationDto>> GetSpecializationsAsync()
        {
            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");
            var cacheKey = $"specializations_{(isArabic ? "ar" : "en")}";

            return await _cache.GetOrCreateAsync(cacheKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = CacheDuration;
                return await _context.Specializations
                    .AsNoTracking()
                    .Select(s => new SpecializationDto
                    {
                        Id = s.Id,
                        Name = isArabic ? s.NameAr : s.NameEn
                    }).ToListAsync();
            }) ?? new List<SpecializationDto>();
        }

        public async Task AddSpecializationAsync(string nameEn, string nameAr)
        {
            _context.Specializations.Add(new Specialization { NameEn = nameEn, NameAr = nameAr });
            await _context.SaveChangesAsync();
            _cache.Remove("specializations_ar");
            _cache.Remove("specializations_en");
        }

        public async Task<List<AllergyDto>> GetAllergiesAsync()
        {
            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");
            var cacheKey = $"allergies_{(isArabic ? "ar" : "en")}";

            return await _cache.GetOrCreateAsync(cacheKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = CacheDuration;
                return await _context.Allergies
                    .AsNoTracking()
                    .Select(a => new AllergyDto
                    {
                        Id = a.Id,
                        Name = isArabic ? a.NameAr : a.NameEn
                    }).ToListAsync();
            }) ?? new List<AllergyDto>();
        }

        public async Task AddAllergyAsync(string nameEn, string nameAr)
        {
            _context.Allergies.Add(new Allergy { NameEn = nameEn, NameAr = nameAr });
            await _context.SaveChangesAsync();
            _cache.Remove("allergies_ar");
            _cache.Remove("allergies_en");
        }

        public async Task<List<StateDto>> GetStatesAsync()
        {
            return await _cache.GetOrCreateAsync("states", async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = CacheDuration;
                return await _context.States
                    .AsNoTracking()
                    .Select(s => new StateDto
                    {
                        Id = s.Id,
                        NameEn = s.NameEn,
                        NameAr = s.NameAr
                    }).ToListAsync();
            }) ?? new List<StateDto>();
        }

        public async Task<List<CityDto>> GetCitiesByStateAsync(int stateId)
        {
            var cacheKey = $"cities_{stateId}";

            return await _cache.GetOrCreateAsync(cacheKey, async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = CacheDuration;
                return await _context.Cities
                    .AsNoTracking()
                    .Where(c => c.StateId == stateId)
                    .Select(c => new CityDto
                    {
                        Id = c.Id,
                        NameEn = c.NameEn,
                        NameAr = c.NameAr,
                        StateId = c.StateId
                    }).ToListAsync();
            }) ?? new List<CityDto>();
        }
    }
}

