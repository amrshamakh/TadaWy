using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Domain.Entities.AuthModels;
using TadaWy.Domain.Entities.Identity;



namespace TadaWy.Applicaation.IServices
{
    public interface IAuthService
    {
        Task<AuthModel> RegisterDoctorAsync(AuthRegisterDoctorDTO authRegisterDoctorDTO);
        Task<AuthModel> AuthLogin(AuthLoginDTO authLoginDTO);
        Task<AuthModel> RegisterPatientAsync(AuthRegisterPatientDTO authRegisterPatientDTO);

        Task<AuthModel> RefreshTokenAsync(string token);
        Task<bool> RevokeTokenAsync(string token);
    }
}
