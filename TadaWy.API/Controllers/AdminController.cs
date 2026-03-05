using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.AdminDTO;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;
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


        
        [HttpGet("doctors")]
        public async Task<IActionResult> GetDoctorsForAdmin( [FromQuery] AdminGetDoctorsRequest request)
        {
            var result = await _adminService.GetDoctorsForAdminAsync(request);
            return Ok(result);
        }

      


        [HttpGet("doctors/{id}")]
        public async Task<ActionResult<DoctorDetailsToAdminDto>> GetDoctorDetailById(int id)
        {
            var result = await _adminService.GetDoctorById(id);
            if (result == null)
                return NotFound("Doctor not found");

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

        [HttpPut("reject-doctor/{doctorId}")]
        public async Task<IActionResult> RejectDoctor(int doctorId, [FromQuery] string RejectionReason)
        {
            var isApproved = await _adminService.RejectDoctorAsync(doctorId,RejectionReason);

            if (!isApproved)
                return NotFound("Doctor not found");

            return Ok("Doctor Rejected successfully");
        }

        [HttpPut("ban-doctor/{doctorId}")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> BanDoctor( int doctorId,[FromBody] string BanningReason)
        {
            var success = await _adminService.BannDoctorAsync(doctorId,BanningReason);
            
            if (!success)
                return NotFound("Doctor not found");

            return Ok("Doctor Banned successfully");
        }

        [HttpPut("unban-doctor/{doctorId}")]
        public async Task<IActionResult> UnbanDoctor(int doctorId)
        {
            var success = await _adminService.UnbanDoctorAsync(doctorId);
            if (!success) return NotFound("error");

            return  Ok("Doctor UnBanned successfully");
        }

        [HttpGet("doctors/{doctorId}/cv")]
        public async Task<IActionResult> GetDoctorCv(int doctorId)
        {
            var doctor = await _adminService.GetDoctorById(doctorId);
            if (doctor == null || string.IsNullOrEmpty(doctor.VerificationDocumentPath))
                return NotFound("CV not found");

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doctor.VerificationDocumentPath.TrimStart('/'));

            if (!System.IO.File.Exists(filePath))
                return NotFound("File not found");

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, "application/pdf", doctor.VerificationDocumentPath);
        }

    }
}
