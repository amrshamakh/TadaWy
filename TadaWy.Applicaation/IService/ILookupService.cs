using TadaWy.Applicaation.DTO.LookUpDTOs;

namespace TadaWy.Applicaation.IService
{
    public interface ILookupService
    {
        Task<List<ChronicDiseaseDto>> GetChronicDiseasesAsync();
        Task AddChronicDiseaseAsync(string nameEn, string nameAr);

        Task<List<SpecializationDto>> GetSpecializationsAsync();
        Task AddSpecializationAsync(string nameEn, string nameAr);

        Task<List<AllergyDto>> GetAllergiesAsync();
        Task AddAllergyAsync(string nameEn, string nameAr);
    }
}
