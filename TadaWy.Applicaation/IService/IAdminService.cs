using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AdminDTO;
using TadaWy.Applicaation.DTO.AuthDTO;

namespace TadaWy.Applicaation.IService
{
    public interface IAdminService
    {
         Task<List<DoctorsIsNotApprovedDto>> GetDoctorNotApprovedAsync();

         Task<bool> ApproveDoctorAsync(int DoctorID);
         Task<bool> RejectDoctorAsync(int DoctorID,string? rejectionReason);
    }
}
