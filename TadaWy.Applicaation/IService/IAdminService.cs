using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AdminDTO;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Applicaation.DTO.Common;

namespace TadaWy.Applicaation.IService
{
    public interface IAdminService
    {
        Task<DoctorDetailsToAdminDto> GetDoctorById(int DoctorId);

        Task<PagedResult<DoctorListToAdmin>> GetDoctorsForAdminAsync(AdminGetDoctorsRequest request);
         Task<bool> ApproveDoctorAsync(int DoctorID);
         Task<bool> RejectDoctorAsync(int DoctorID,string? rejectionReason);
    }
}
