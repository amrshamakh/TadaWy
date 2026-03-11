using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupController(ILookupService _lookupService) : ControllerBase
    {
        
        [HttpGet("chronic-diseases")]
        public async Task<IActionResult> GetChronicDiseases()
        {
            var diseases = await _lookupService.GetChronicDiseasesAsync();
            return Ok(diseases);
        }

        [HttpPost("chronic-diseases")]
        public async Task<IActionResult> AddChronicDisease([FromQuery] string name)
        {
            await _lookupService.AddChronicDiseaseAsync(name);
            return Ok(new { message = "Chronic disease added to the list" });
        }

        [HttpGet("specializations")]
        public async Task<IActionResult> GetSpecializations()
        {
            var specializations = await _lookupService.GetSpecializationsAsync();
            return Ok(specializations);
        }

        [HttpPost("specializations")]
        public async Task<IActionResult> AddSpecialization([FromQuery] string name)
        {
            await _lookupService.AddSpecializationAsync(name);
            return Ok(new { message = "Specialization added to master list" });
        }

        [HttpGet("allergies")]
        public async Task<IActionResult> GetAllergies()
        {
            var allergies = await _lookupService.GetAllergiesAsync();
            return Ok(allergies);
        }

        [HttpPost("allergies")]
        public async Task<IActionResult> AddAllergy([FromQuery] string name)
        {
            await _lookupService.AddAllergyAsync(name);
            return Ok(new { message = "Allergy added to the list" });
        }
    }
}
