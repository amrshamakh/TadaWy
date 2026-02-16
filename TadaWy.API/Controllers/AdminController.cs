using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.DTO.AdminDTO;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;
using TadaWy.Infrastructure.Service;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IEmailService _emailService;

        public AdminController(IAdminService adminService, IEmailService emailService)
        {
            _adminService = adminService;
            _emailService = emailService;
        }


        
        [HttpGet("admin/doctors")]
        public async Task<IActionResult> GetDoctorsForAdmin( [FromQuery] AdminGetDoctorsRequest request)
        {
            var result = await _adminService.GetDoctorsForAdminAsync(request);
            return Ok(result);
        }


        [HttpGet("doctors/{id}")]
        public async Task<ActionResult<List<DoctorDetailsToAdminDto>>> GetDoctorById(int id)
        {
            var result = await _adminService.GetDoctorById(id);
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

        [HttpPut("Reject-doctor/{doctorId}")]
        public async Task<IActionResult> RejectDoctor(int doctorId, [FromQuery] string RejectionReason)
        {
            var isApproved = await _adminService.RejectDoctorAsync(doctorId,RejectionReason);

            if (!isApproved)
                return NotFound("Doctor not found");

            return Ok("Doctor Rejected successfully");
        }

    }
}
