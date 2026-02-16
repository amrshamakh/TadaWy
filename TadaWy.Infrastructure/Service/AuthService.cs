using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Numerics;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AddressDto;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.AuthModels;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Helpers;
using TadaWy.Domain.ValueObjects;
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
        private readonly IGeocodingService geocodingService;

        public AuthService(UserManager<ApplicationUser> userManager,IOptions<JWT> Jwt,TadaWyDbContext tadaWyDbContext,IFileStorageService fileStorage,IGeocodingService geocodingService)
        {
            _userManager = userManager;
            jwt = Jwt;
            _Jwt =Jwt.Value;
            _tadaWyDbContext = tadaWyDbContext;
            this.fileStorage = fileStorage;
            this.geocodingService = geocodingService;
        }
        

        public async Task<AuthModel> RegisterDoctorAsync(AuthRegisterDoctorDTO authRegisterDoctorDTO)
        {
            if (await _userManager.FindByEmailAsync(authRegisterDoctorDTO.Email) is not null)
                return new AuthModel { Messege = "This Email IS Already Registered" };

            if(authRegisterDoctorDTO.password!=authRegisterDoctorDTO.Confirmpassword)
            {
                return new AuthModel { Messege = "passwords is not match" };
            }
            
            var user = new ApplicationUser
            {
                Email = authRegisterDoctorDTO.Email,
             
                PhoneNumber = authRegisterDoctorDTO.PhoneNumber,
                UserName=authRegisterDoctorDTO.Email
                   
            };
           var result= await _userManager.CreateAsync(user, authRegisterDoctorDTO.password);

            if (!result.Succeeded)
            {
                var errors = string.Empty;

                foreach (var error in result.Errors)
                {
                    errors += $"{error.Description}";
                }
                return new AuthModel {
                    Messege = errors
                };
            }
            await _userManager.AddToRoleAsync(user, "Doctor");

            var addressDto = await geocodingService.GetAddressAsync(authRegisterDoctorDTO.Latitude, authRegisterDoctorDTO.Longitude);

            if (addressDto is null)
                throw new Exception("Could not resolve address.");// will be handeled later in the exception handling middleware

            var filePath = await fileStorage.SaveFileAsync(authRegisterDoctorDTO.FileStream, authRegisterDoctorDTO.FileName);
            var doctor = new Doctor
            {
                FirstName = authRegisterDoctorDTO.FirstName,
                LastName = authRegisterDoctorDTO.LastName,
                UserID = user.Id,
                IsApproved = false,
                Location = new GeoLocation(authRegisterDoctorDTO.Latitude, authRegisterDoctorDTO.Longitude),
                Address = new Address(addressDto.Street ?? "UnKnown", addressDto.City ?? "UnKnown", addressDto.State ?? "UnKnown"),
                AddressDescription = authRegisterDoctorDTO.AddressDescription,
                SpecializationId = authRegisterDoctorDTO.SpecializationId,
                VerificationDocumentPath = filePath


            };
             _tadaWyDbContext.Add(doctor);
            _tadaWyDbContext.SaveChanges();
;
            return new AuthModel
            {
                Success = true,
                Messege = "Data send to Admin"
            };
        }

        public async Task<AuthModel> RegisterPatientAsync(AuthRegisterPatientDTO RegisterPatientAsync)
        {
            if (await _userManager.FindByEmailAsync(RegisterPatientAsync.Email) is not null)
                return new AuthModel { Messege = "This Email IS Already Registered" };

            if (RegisterPatientAsync.password != RegisterPatientAsync.Confirmpassword)
            {
                return new AuthModel { Messege = "passwords is not match" };
            }

            var user = new ApplicationUser
            {
                Email = RegisterPatientAsync.Email,

                PhoneNumber = RegisterPatientAsync.PhoneNumber,
                UserName = RegisterPatientAsync.Email

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

            var addressDto = new AddressDto();
            if ((RegisterPatientAsync.Latitude is not null) && (RegisterPatientAsync.Longitude is not null)) { 
                 addressDto = await geocodingService.GetAddressAsync(RegisterPatientAsync.Latitude, RegisterPatientAsync.Longitude);
                if (addressDto is null)
                    throw new Exception("Could not resolve address.");// will be handeled later in the exception handling middleware
            }
           
            var patient = new Patient
            {
                FirstName = RegisterPatientAsync.FirstName,
                LastName = RegisterPatientAsync.LastName,
                UserID = user.Id,
                DateOfBirth = RegisterPatientAsync.DateOfBirth,
                Gendre = RegisterPatientAsync.Gendre,
                Location = new GeoLocation(RegisterPatientAsync.Latitude, RegisterPatientAsync.Longitude),
                Address=new Address(addressDto.Street?? "UnKnown",addressDto.City?? "UnKnown",addressDto.State?? "UnKnown")
                
            };
            _tadaWyDbContext.Add(patient);
            _tadaWyDbContext.SaveChanges();
            ;

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

            var roles = await _userManager.GetRolesAsync(User);

            
            if (roles.Contains("Doctor"))
            {
                var doctor =await _tadaWyDbContext.Doctors.FirstOrDefaultAsync(d => d.UserID == User.Id);
                if (doctor == null)
                {
                    authModel.Messege = "Doctor profile not found";
                    return authModel;
                }

                if (doctor.IsRejected)
                {
                    authModel.Messege = $"Your account was rejected. Reason: {doctor.RejectionReason}";
                    return authModel;
                }

                if (!doctor.IsApproved)
                {
                    authModel.Messege = "Your account is pending admin approval";
                    return authModel;
                }
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

        public async Task<AuthModel> RefreshTokenAsync(string refreshtoken)
        {
            var authModel = new AuthModel();
            var user=await _userManager.Users.SingleOrDefaultAsync(u=>u.RefreshTokens.Any(t=>t.Token== refreshtoken));

            if (user == null) {

                authModel.Messege="Invalid Token";
                return authModel;
            }
            var refreshToken=user.RefreshTokens.Single(t=>t.Token== refreshtoken);

            if(!refreshToken.IsActive)
            {
                authModel.Messege = "Invalid Token";
                return authModel;
            }
            refreshToken.RevokedOn = DateTime.UtcNow;

            var newRefreshToken=GenerateRefreshToken();
            user.RefreshTokens.Add(newRefreshToken);
            await _userManager.UpdateAsync(user);

            var jwtToken = await CreateJwtToken(user);


            authModel.IsAuthenticated = true;
            authModel.RefreshToken = newRefreshToken.Token;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtToken);
            authModel.Email = user.Email;
            authModel.Username = user.Email;
            var Roles=await _userManager.GetRolesAsync(user);
            authModel.Role = Roles.ToList();
            authModel.RefreshTokenExpireOn = newRefreshToken.ExpireOn;

            return authModel;
        }

        public async Task<bool> RevokeTokenAsync(string token)
        {
           
            var user = await _userManager.Users.SingleOrDefaultAsync(u => u.RefreshTokens.Any(t => t.Token == token));

            if (user == null)
            
                return false;
               
            var refreshToken = user.RefreshTokens.Single(t => t.Token == token);

            if (!refreshToken.IsActive)
                return false;
        
            refreshToken.RevokedOn = DateTime.UtcNow;

            await _userManager.UpdateAsync(user);
            return true;
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
