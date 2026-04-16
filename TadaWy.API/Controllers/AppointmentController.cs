using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TadaWy.Applicaation.DTO.AppointmentDTOs;
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
        private readonly IPatientService _patientService;

        public AppointmentsController(IAppointmentService service,IPatientService patientService)
        {
            _service = service;
            _patientService = patientService;
        }

        [HttpPost("offline")]
        public async Task<ActionResult> CreateOffline([FromBody] CreateAppointmentRequest model)
        {
            var result= _service.CreateOfflineAppointmentAndReturnReciptAsync(model);

            return Ok(result);
        }
    }
}
