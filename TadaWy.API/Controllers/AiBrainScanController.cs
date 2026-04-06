using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.DTO.AiDTOS;
using TadaWy.Applicaation.IService;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TadaWy.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AiBrainScanController : ControllerBase
    {
        private readonly IAiBrainScanAppService _service;

        public AiBrainScanController(IAiBrainScanAppService service)
        {
            _service = service;
        }

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload([FromForm] UploadAiBrainScanRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { message = "Invalid token." });

                var result = await _service.UploadScanAsync(request.File, userId);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }
    }
}