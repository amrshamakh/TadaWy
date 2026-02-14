using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TadaWy.API.Requests;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Applicaation.IServices;
using TadaWy.Infrastructure.Presistence;

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

        private void SetRefreshTokenInCookie(string RefreshToken, DateTime Expires)
        {
            var cookieOption = new CookieOptions
            {
                HttpOnly = true,
                Expires = Expires
            };

            Response.Cookies.Append("refreshToken", RefreshToken, cookieOption);
        }
    }
}
