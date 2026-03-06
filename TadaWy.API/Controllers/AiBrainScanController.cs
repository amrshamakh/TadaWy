using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.DTO.AiDTOS;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Controllers
{
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
                var result = await _service.UploadScanAsync(request.File, request.UserId);

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