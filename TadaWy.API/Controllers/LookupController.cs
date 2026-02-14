using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookupController(ILookupService _lookupService) : ControllerBase
    {
        
        [HttpGet("chronicdiseases")]
        public async Task<IActionResult> GetChronicDiseases()
        {
            var diseases = await _lookupService.GetChronicDiseasesAsync();
            return Ok(diseases);
        }
    }
}
