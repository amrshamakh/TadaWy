using TadaWy.Applicaation.DTO.LookUpDTOs;

namespace TadaWy.Applicaation.IService
{
    public interface ILookupService
    {
        Task<List<ChronicDiseaseDto>> GetChronicDiseasesAsync();
        Task AddChronicDiseaseAsync(string name);

        Task<List<SpecializationDto>> GetSpecializationsAsync();
        Task AddSpecializationAsync(string name);

        Task<List<AllergyDto>> GetAllergiesAsync();
        Task AddAllergyAsync(string name);
    }
}
