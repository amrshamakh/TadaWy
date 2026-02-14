using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Applicaation.IService;
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
        private readonly IOptions<JWT> jwt;
        private readonly JWT _Jwt;
        TadaWyDbContext _tadaWyDbContext;
        private readonly IFileStorageService fileStorage;

        public AuthService(UserManager<ApplicationUser> userManager,IOptions<JWT> Jwt,TadaWyDbContext tadaWyDbContext,IFileStorageService fileStorage)
        {
            _userManager = userManager;
            jwt = Jwt;
            _Jwt =Jwt.Value;
            _tadaWyDbContext = tadaWyDbContext;
            this.fileStorage = fileStorage;
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

            var filePath = await fileStorage.SaveFileAsync(authRegisterDoctorDTO.FileStream, authRegisterDoctorDTO.FileName);
            var doctor = new Doctor
            {
                FirstName = authRegisterDoctorDTO.FirstName,
                LastName = authRegisterDoctorDTO.LastName,
                UserID = user.Id,
               IsApproved=false,
<<<<<<< Updated upstream
               SpecializationId=authRegisterDoctorDTO.SpecializationId,
                VerificationDocumentPath=filePath
=======
               Specialization=authRegisterDoctorDTO.Specialization,
               VerificationDocumentPath=filePath
>>>>>>> Stashed changes

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

            var refreshToken = GenerateRefreshToken();
            user.RefreshTokens.Add(refreshToken);
            await _userManager.UpdateAsync(user);

            return new AuthModel
            {
                Email = user.Email,
                IsAuthenticated = true,
                Username = user.UserName,
                Token = stringtoken,
                Role = new List<string> { "Patient" },
                RefreshToken = refreshToken.Token,
                RefreshTokenExpireOn = refreshToken.ExpireOn,
                ExpireOn = JWTSecurityToken.ValidTo
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
            AuthModel authModel = new AuthModel();
            var User = (await _userManager.FindByEmailAsync(authLoginDTO.Email));

            if (User is null || !await _userManager.CheckPasswordAsync(User, authLoginDTO.Password))
            {
                authModel.Messege = "Email Or Password is Incorrect";
                return authModel;
            }

            var JWTSecurityToken = await CreateJwtToken(User);
            var stringtoken = new JwtSecurityTokenHandler().WriteToken(JWTSecurityToken);


            authModel.Email = User.Email;
            authModel.IsAuthenticated = true;
            authModel.Username = User.UserName;
            authModel.Token = stringtoken;
            authModel.Role = (await _userManager.GetRolesAsync(User)).ToList();
            authModel.ExpireOn = JWTSecurityToken.ValidTo;

            if (User.RefreshTokens.Any(t => t.IsActive))
            {
                var activeRefreshToken = User.RefreshTokens.FirstOrDefault(t => t.IsActive);
                authModel.RefreshToken = activeRefreshToken.Token;
                authModel.RefreshTokenExpireOn = activeRefreshToken.ExpireOn.ToLocalTime();
            }
            else
            {
                var refreshToken = GenerateRefreshToken();
                authModel.RefreshToken = refreshToken.Token;
                authModel.RefreshTokenExpireOn = refreshToken.ExpireOn.ToLocalTime();
                User.RefreshTokens.Add(refreshToken);
                await _userManager.UpdateAsync(User);
            }

            return authModel;

        }

        private RefreshToken GenerateRefreshToken()
        {
            var RAndomNumber = new byte[32];

            using var generator = new RNGCryptoServiceProvider();

            generator.GetBytes(RAndomNumber);

            return new RefreshToken
            {
                Token = Convert.ToBase64String(RAndomNumber),
                ExpireOn = DateTime.UtcNow.AddDays(10),
                CreatedOn = DateTime.UtcNow

            };
        }

      
    }
}
