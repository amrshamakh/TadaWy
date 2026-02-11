using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Applicaation.IServices;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Helpers;
using TadaWy.Infrastructure.Presistence;


namespace TadaWy.Infrastructure.service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JWT _Jwt;
        TadaWyDbContext _tadaWyDbContext;
        public AuthService(UserManager<ApplicationUser> userManager,IOptions<JWT> Jwt,TadaWyDbContext tadaWyDbContext)
        {
            _userManager = userManager;
            _Jwt=Jwt.Value;
            _tadaWyDbContext = tadaWyDbContext;
        }


        public async Task<AuthModel> RegisterDoctorAsync(AuthRegisterDoctorDTO authRegisterDoctorDTO)
        {
            if (await _userManager.FindByEmailAsync(authRegisterDoctorDTO.Email) is not null)
                return new AuthModel { Messege = "This Email IS Already Registered" };

            var user = new ApplicationUser
            {
                Email = authRegisterDoctorDTO.Email,
             
                PhoneNumber = authRegisterDoctorDTO.PhoneNumber,
                   
            };
           var result= await _userManager.CreateAsync(user, authRegisterDoctorDTO.password);

            if (!result.Succeeded)
            {
                var errors = string.Empty;

                foreach (var error in result.Errors)
                {
                    errors += $"{error.Description}";
                    return new AuthModel { 
                        Messege = errors };
                }
            }
            await _userManager.AddToRoleAsync(user, "Doctor");


            var doctor = new Doctor
            {
                FirstName = authRegisterDoctorDTO.FirstName,
                LastName = authRegisterDoctorDTO.LastName,
                UserID = user.Id,
               IsApproved=false,
               Specialization=authRegisterDoctorDTO.Specialization,
               
               
            };
             _tadaWyDbContext.Add(doctor);
            _tadaWyDbContext.SaveChanges();
;
            return new AuthModel
            {
                Messege = "Data send to Admin"
            };
        }
        //var JWTSecurityToken = await CreateJwtToken(user);
        //var stringtoken = new JwtSecurityTokenHandler().WriteToken(JWTSecurityToken);

        //    return new AuthModel
        //    {
        //        Email = user.Email,
        //        ExpireOn = JWTSecurityToken.ValidTo,
        //        IsAuthenticated = true,
        //        Username = user.UserName,
        //        Token = stringtoken,
        //        Role = new List<string> { "Doctor" },
        //    };
    public async Task<AuthModel> RegisterPatientAsync(AuthRegisterPatientDTO RegisterPatientAsync)
        {
            if (await _userManager.FindByEmailAsync(RegisterPatientAsync.Email) is not null)
                return new AuthModel { Messege = "This Email IS Already Registered" };

            var user = new ApplicationUser
            {
                Email = RegisterPatientAsync.Email,
              
                PhoneNumber = RegisterPatientAsync.PhoneNumber,
              
            };
            var result = await _userManager.CreateAsync(user, RegisterPatientAsync.password);

            if (!result.Succeeded)
            {
                var errors = string.Empty;

                foreach (var error in result.Errors)
                {
                    errors += $"{error.Description}";
                    return new AuthModel { Messege = errors };
                }
            }
            await _userManager.AddToRoleAsync(user, "Patient");

            var patient = new Patient
            {
                FirstName = RegisterPatientAsync.FirstName,
                LastName = RegisterPatientAsync.LastName,
                UserID = user.Id,
                DateOfBirth = RegisterPatientAsync.DateOfBirth,
                Gendre = RegisterPatientAsync.Gendre,
            };

            

            var JWTSecurityToken = await CreateJwtToken(user);
            var stringtoken = new JwtSecurityTokenHandler().WriteToken(JWTSecurityToken);

            return new AuthModel
            {
                Email = user.Email,
                ExpireOn = JWTSecurityToken.ValidTo,
                IsAuthenticated = true,
                Username = user.UserName,
                Token = stringtoken,
                Role = new List<string> { "Patient" },
            };

        }

        public async Task<JwtSecurityToken> CreateJwtToken(ApplicationUser applicationUser)
        {
            var UserClaims = await _userManager.GetClaimsAsync(applicationUser);
            var Roles = await _userManager.GetRolesAsync(applicationUser);
            var roleClaims = new List<Claim>();

            foreach (var role in Roles)
            {
                roleClaims.Add(new Claim("Roles", role));
            }

            var Claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Email,applicationUser.Email),
                new Claim(JwtRegisteredClaimNames.Sub,applicationUser.PhoneNumber),
            }
            .Union(roleClaims)
            .Union(UserClaims);

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_Jwt.Key));
            var singcre = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var JWTToken = new JwtSecurityToken
            (
                issuer: _Jwt.Issuer,
                audience: _Jwt.Audience,
                claims: Claims,
                expires: DateTime.Now.AddDays(_Jwt.DurationInDays),
                signingCredentials: singcre);

            return JWTToken;


        }

        public async Task<AuthModel> AuthLogin(AuthLoginDTO authLoginDTO)
        {
            var User = (await _userManager.FindByEmailAsync(authLoginDTO.Email));

            if(User is null || !await _userManager.CheckPasswordAsync(User, authLoginDTO.Password))
            {
                return new AuthModel { Messege = "Email Or Password is Incorrect" };
            }

            var JWTSecurityToken = await CreateJwtToken(User);
            var stringtoken = new JwtSecurityTokenHandler().WriteToken(JWTSecurityToken);

            return new AuthModel
            {
                Email = User.Email,
                ExpireOn = JWTSecurityToken.ValidTo,
                IsAuthenticated = true,
                Username = User.UserName,
                Token = stringtoken,
                Role =(await _userManager.GetRolesAsync(User)).ToList()
            };
        }
    }
}
