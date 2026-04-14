using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;
using TadaWy.Infrastructure.Service;

namespace TadaWy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _service;
       
        public AppointmentsController(IAppointmentService service)
        {
            _service = service;
        }

        [HttpGet("calendar")]
        public async Task<IActionResult> GetCalendar(int month, int year)
        {
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userid == null)
            {
                return Unauthorized("User not Found");
            }
            var patientId = _service.GetPatientId(userid);
            var result = await _service.GetCalendarAsync(month, year, patientId);
            return Ok(result);
        }

        [HttpPost("cancel/{appointmentId}")]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized("User not Found");
            }
            var patientId =_service.GetPatientId(userId);

            if (patientId == null)
                return Unauthorized();

            var result = await _service.CancelAppointmentAsync(appointmentId, patientId);

            if (!result)
                return BadRequest("Cannot cancel this appointment");

            return Ok("Appointment cancelled successfully");
        }

        [HttpGet("receipt/{appointmentId}")]
        public async Task<IActionResult> GetReceipt(int appointmentId)
        {
            var data = await _service.GetReceipt(appointmentId);
            return Ok(data);
        }

        [HttpGet("by-date")]
        public async Task<IActionResult> GetByDate(DateTime date)
        {
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userid == null)
            {
                return Unauthorized("User not Found");
            }
            var patientId = _service.GetPatientId(userid);
            var result = await _service.GetAppointmentsByDateAsync(date, patientId);
            return Ok(result);
        }

        [HttpGet("by-status")]
        public async Task<IActionResult> GetbyStatus(AppointmentStatus status)
        {
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userid == null)
            {
                return Unauthorized("User not Found");
            }
            var patientId = _service.GetPatientId(userid);
            var result = await _service.GetPatientAppointmentsAsync(patientId, status);
            return Ok(result);
        }

       
    }
}
