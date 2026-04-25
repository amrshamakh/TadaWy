using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
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

            return Ok(doctor);
        }
        [Authorize(Roles = "Doctor")]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var profile = await _doctorService.GetDoctorProfileAsync(userId);

            return Ok(profile);
        }
        [Authorize(Roles = "Doctor")]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateDoctorProfileDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            await _doctorService.UpdateDoctorProfileAsync(userId, dto);

            return Ok(new { message = "Profile updated successfully" });
        }

        [Authorize(Roles = "Doctor")]
        [HttpPost("profile/image")]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var imageUrl = await _doctorService.UploadDoctorImageAsync(userId, image);

            return Ok(new { imageUrl });
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("schedule")]
        public async Task<IActionResult> GetSchedule()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _doctorService.GetDoctorScheduleAsync(userId);
            return Ok(result);
        }

        [Authorize(Roles = "Doctor")]
        [HttpPost("schedule")]
        public async Task<IActionResult> UpdateSchedule(UpdateDoctorScheduleDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _doctorService.UpdateDoctorScheduleAsync(userId, dto);
            return Ok(new { message = "Schedule updated successfully" });
        }

        [Authorize(Roles = "Doctor")]
        [HttpPost("schedule/timeslot")]
        public async Task<IActionResult> AddTimeSlot(AddDoctorTimeSlotDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _doctorService.AddTimeSlotAsync(userId, dto);
            return Ok(new { message = "Time slot added successfully" });
        }

        [Authorize(Roles = "Doctor")]
        [HttpGet("schedule/summary")]
        public async Task<IActionResult> GetScheduleSummary()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var result = await _doctorService.GetDoctorWeeklySummaryAsync(userId);
            return Ok(result);
        }

        [Authorize(Roles = "Doctor")]
        [HttpPost("Appointments/cancel/{appointmentId}")]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _doctorService.CancelAppointmentAsync(appointmentId, userId);
            if (!result) return BadRequest("Could not cancel appointment");

            return Ok(new { message = "Appointment cancelled successfully" });
        }

        [Authorize(Roles = "Doctor")]
        [HttpPost("Appointments/confirm/{appointmentId}")]
        public async Task<IActionResult> ConfirmAppointment(int appointmentId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _doctorService.ConfirmAppointmentAsync(appointmentId, userId);
            if (!result) return BadRequest("Could not confirm appointment");

            return Ok(new { message = "Appointment confirmed successfully" });
        }
    }
}
