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
        [Consumes("")]
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
                Specialization = request.Specialization,
                FileName = request.VerificationDocument.FileName,
                FileStream = request.VerificationDocument.OpenReadStream()
            };
            var result = await _authService.RegisterDoctorAsync(dto);

            if (!result.IsAuthenticated)
            {
                return BadRequest(result.Messege);
            }
            
            return Ok(new { token = result.Token, expireOn = result.ExpireOn, Role = result.Role });
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
            return Ok(new { token = result.Token, expireOn = result.ExpireOn, Role = result.Role });
        }
    }
}
