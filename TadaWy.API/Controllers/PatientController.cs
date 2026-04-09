using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TadaWy.Applicaation.DTO.PatientDTOs;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var profile = await _patientService.GetPatientProfileAsync(userId);
            return Ok(profile);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdatePatientProfileDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _patientService.UpdatePatientProfileAsync(userId, dto);
            return Ok(new { message = "Profile updated successfully" });
        }

        [HttpGet("chronic-diseases")]
        public async Task<IActionResult> GetChronicDiseases()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var diseases = await _patientService.GetPatientChronicDiseasesAsync(userId);
            return Ok(diseases);
        }

        [HttpPost("chronic-diseases/{id}")]
        public async Task<IActionResult> AddChronicDisease(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _patientService.AddPatientChronicDiseaseAsync(userId, id);
            return Ok(new { message = "Chronic disease added successfully" });
        }

        [HttpDelete("chronic-diseases/{id}")]
        public async Task<IActionResult> RemoveChronicDisease(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _patientService.RemovePatientChronicDiseaseAsync(userId, id);
            return Ok(new { message = "Chronic disease removed successfully" });
        }

        [HttpGet("allergies")]
        public async Task<IActionResult> GetAllergies()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var allergies = await _patientService.GetPatientAllergiesAsync(userId);
            return Ok(allergies);
        }

        [HttpPost("allergies/{id}")]
        public async Task<IActionResult> AddAllergy(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _patientService.AddPatientAllergyAsync(userId, id);
            return Ok(new { message = "Allergy added successfully" });
        }

        [HttpDelete("allergies/{id}")]
        public async Task<IActionResult> RemoveAllergy(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _patientService.RemovePatientAllergyAsync(userId, id);
            return Ok(new { message = "Allergy removed successfully" });
        }

        [Authorize(Roles = "Patient")]
        [HttpPost("review")]
        public async Task<IActionResult> SubmitReview(AddReviewDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            await _patientService.SubmitReviewAsync(userId, dto);
            return Ok(new { message = "Review submitted successfully" });
        }
    }
}
