using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}
