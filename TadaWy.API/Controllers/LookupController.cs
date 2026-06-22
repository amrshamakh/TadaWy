using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupController(ILookupService _lookupService) : ControllerBase
    {
        
        [HttpGet("chronic-diseases")]
        [ResponseCache(Duration = 300, VaryByHeader = "Accept-Language")]
        public async Task<IActionResult> GetChronicDiseases()
        {
            var diseases = await _lookupService.GetChronicDiseasesAsync();
            return Ok(diseases);
        }

        [HttpPost("chronic-diseases")]
        public async Task<IActionResult> AddChronicDisease([FromQuery] string nameEn, [FromQuery] string nameAr)
        {
            await _lookupService.AddChronicDiseaseAsync(nameEn, nameAr);
            return Ok(new { message = "Chronic disease added to the list" });
        }

        [HttpGet("specializations")]
        [ResponseCache(Duration = 300, VaryByHeader = "Accept-Language")]
        public async Task<IActionResult> GetSpecializations()
        {
            var specializations = await _lookupService.GetSpecializationsAsync();
            return Ok(specializations);
        }

        [HttpPost("specializations")]
        public async Task<IActionResult> AddSpecialization([FromQuery] string nameEn, [FromQuery] string nameAr)
        {
            await _lookupService.AddSpecializationAsync(nameEn, nameAr);
            return Ok(new { message = "Specialization added to master list" });
        }

        [HttpGet("allergies")]
        [ResponseCache(Duration = 300, VaryByHeader = "Accept-Language")]
        public async Task<IActionResult> GetAllergies()
        {
            var allergies = await _lookupService.GetAllergiesAsync();
            return Ok(allergies);
        }

        [HttpPost("allergies")]
        public async Task<IActionResult> AddAllergy([FromQuery] string nameEn, [FromQuery] string nameAr)
        {
            await _lookupService.AddAllergyAsync(nameEn, nameAr);
            return Ok(new { message = "Allergy added to the list" });
        }

        [HttpGet("states")]
        [ResponseCache(Duration = 300, VaryByHeader = "Accept-Language")]
        public async Task<IActionResult> GetStates()
        {
            var states = await _lookupService.GetStatesAsync();
            return Ok(states);
        }

        [HttpGet("states/{stateId}/cities")]
        [ResponseCache(Duration = 300, VaryByHeader = "Accept-Language")]
        public async Task<IActionResult> GetCities(int stateId)
        {
            var cities = await _lookupService.GetCitiesByStateAsync(stateId);
            return Ok(cities);
        }
    }
}
