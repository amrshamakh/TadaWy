
using TadaWy.Applicaation.DTO.Common;
using TadaWy.Applicaation.DTO.DoctorDTOs;

namespace TadaWy.Applicaation.IService
{
    public interface IDoctorService
    {
        Task<PagedResult<DoctorListDto>> GetDoctorsAsync(GetDoctorsRequest request);
        Task<DoctorDetailsDto?> GetDoctorByIdAsync(int id);
    }
}
