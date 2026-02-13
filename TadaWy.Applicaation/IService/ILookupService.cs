using TadaWy.Applicaation.DTO.LookUpDTOs;

namespace TadaWy.Applicaation.IService
{
    public interface ILookupService
    {
        Task<List<ChronicDiseaseDto>> GetChronicDiseasesAsync();

    }
}
