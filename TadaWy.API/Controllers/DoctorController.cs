using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TadaWy.Applicaation.DTO.DoctorDTOs;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDoctors([FromQuery] GetDoctorsRequest request)
        {
            var result = await _doctorService.GetDoctorsAsync(request);
            return Ok(result);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            var doctor = await _doctorService.GetDoctorByIdAsync(id);

            if (doctor == null)
                return NotFound(new
                {
                    success = false,
                    message = "Doctor not found"
                });

            return Ok(new
            {
                success = true,
                data = doctor,
                message = "Doctor retrieved successfully"
            });
        }
        [Authorize(Roles = "Doctor")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var profile = await _doctorService.GetDoctorProfileAsync(userId);

            return Ok(profile);
        }
        [Authorize(Roles = "Doctor")]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateDoctorProfileDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var result =await _doctorService.UpdateDoctorProfileAsync(userId, dto);
            if (!result)
                return BadRequest(new { message = "Failed to update profile" });

            return Ok(new { message = "Profile updated successfully" });
        }

        [Authorize(Roles = "Doctor")]
        [HttpPost("profile/image")]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var imageUrl = await _doctorService.UploadDoctorImageAsync(userId, image);

            return Ok(new { imageUrl });
        }
    }
}
