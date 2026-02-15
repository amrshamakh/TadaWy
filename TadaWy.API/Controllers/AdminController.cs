using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.DTO.AdminDTO;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }


        [HttpGet("doctors/pending")]
        public async Task<ActionResult<List<DoctorsIsNotApprovedDto>>> GetPendingDoctorsAsync()
        {
            var result = await _adminService.GetDoctorNotApprovedAsync();
            return Ok(result);
        }

        [HttpPut("approve-doctor/{doctorId}")]
        public async Task<IActionResult> ApproveDoctor(int doctorId)
        {
            var isApproved = await _adminService.ApproveDoctorAsync(doctorId);

            if (!isApproved)
                return NotFound("Doctor not found");

            return Ok("Doctor approved successfully");
        }

    }
}
