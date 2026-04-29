using Azure.Core;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TadaWy.API.Requests;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Applicaation.DTO.ResetPasswordDTOs;
using TadaWy.Applicaation.IServices;
using TadaWy.Domain.Entities.AuthModels;
using TadaWy.Infrastructure.Presistence;
using Microsoft.AspNetCore.Identity;
using TadaWy.Domain.Entities;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("RegisterDoctor")]

        [Consumes("multipart/form-data")]
        public async Task<IActionResult> RegisterDoctorAsync([FromForm] RegisterDoctorRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var dto = new AuthRegisterDoctorDTO
            {
                Email = request.Email,
                password = request.password,
                PhoneNumber = request.PhoneNumber,
                FirstName = request.FirstName,
                LastName = request.LastName,
                SpecializationId = request.SpecializationId,
                CareerStartDate = request.CareerStartDate,
                AddressDescription = request.AddressDescription,
                Confirmpassword=request.ConfirmPassword,
                Latitude = request.Latitude,
                Longitude = request.Longitude,
                FileName = request.VerificationDocument.FileName,
                FileStream = request.VerificationDocument.OpenReadStream()
            };
            var result = await _authService.RegisterDoctorAsync(dto);
            if(!result.Success)return BadRequest(result.Messege);
            else return Ok(result.Messege);
        }

        [HttpPost("RegisterPatient")]
        public async Task<IActionResult> RegisterPatientAsync([FromBody] AuthRegisterPatientDTO authRegisterPatientDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.RegisterPatientAsync(authRegisterPatientDTO);

            if (!result.IsAuthenticated)
            {
                return BadRequest(result.Messege);
            }

            if (!string.IsNullOrEmpty(result.RefreshToken))
                SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpireOn);

            return Ok(new { token = result.Token, expireOn = result.ExpireOn, Role = result.Role });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] AuthLoginDTO authLogin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.AuthLogin(authLogin);

            if (!result.IsAuthenticated)
            {
                return BadRequest(result.Messege);
            }

            if (!string.IsNullOrEmpty(result.RefreshToken))
                SetRefreshTokenInCookie(result.RefreshToken, result.RefreshTokenExpireOn);


            return Ok(new { token = result.Token, expireOn = result.ExpireOn, Role = result.Role });
        }

        [HttpGet("refreshToken")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            var result=await _authService.RefreshTokenAsync(refreshToken);

            if (!result.IsAuthenticated)
                return BadRequest(result);

            SetRefreshTokenInCookie(result.RefreshToken,result.RefreshTokenExpireOn);

            return Ok(result); 

        }

        [HttpPost("RevokeToken")]
        public async Task<IActionResult> RevokeToken([FromBody]RevokeToken model)
        {
            var token = model.Token ?? Request.Cookies["refreshToken"];

            if (string.IsNullOrEmpty(token))
                return BadRequest("Token is requred!");

            var result=await _authService.RevokeTokenAsync(token);

            if(!result)
                return BadRequest("Token is invalid!");

            return Ok();
        }

        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPassword(RequestForgetPasswordDTO dto)
        {
            await _authService.ForgetPasswordAsync(dto.Email);
            return Ok("If email exists, reset link will be sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDTO dto)
        {
            var result = await _authService.ResetPasswordAsync(dto);
            if (!result)
                return BadRequest();

            return Ok("Password reset successfully");
        }
        

        private void SetRefreshTokenInCookie(string RefreshToken, DateTime Expires)
        {
            var cookieOption = new CookieOptions
            {
                HttpOnly = true,
                Expires = Expires
            };

            Response.Cookies.Append("refreshToken", RefreshToken, cookieOption);
        }

        [HttpGet("google-login")]
        [AllowAnonymous]
        public IActionResult GoogleLogin()
        {
            var redirectUrl = Url.Action( nameof(GoogleCallback), "Auth",values: null,protocol: Request.Scheme,host: Request.Host.ToString());

            var properties = new AuthenticationProperties
            {
                RedirectUri = redirectUrl!
            };

            
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var authenticateResult =
                await HttpContext.AuthenticateAsync(IdentityConstants.ExternalScheme);

            if (!authenticateResult.Succeeded || authenticateResult.Principal == null)
                return Unauthorized(new { message = "Google authentication failed" });

            var email = authenticateResult.Principal
                .FindFirst(ClaimTypes.Email)?.Value;

            var authModel = await _authService.LoginWithGoogleAsync(email);

            return Ok(authModel);
        }
    }
}
