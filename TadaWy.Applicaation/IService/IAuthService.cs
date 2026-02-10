using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;



namespace TadaWy.Applicaation.IServices
{
    public interface IAuthService
    {
        Task<AuthModel> RegisterDoctorAsync(AuthRegisterDoctorDTO authRegisterDoctorDTO);
        Task<AuthModel> AuthLogin(AuthLoginDTO authLoginDTO);

        //Task<JwtSecurityToken> CreateJwtToken(ApplicationUser applicationUser);

        Task<AuthModel> RegisterPatientAsync(AuthRegisterPatientDTO authRegisterPatientDTO);
    }
}
