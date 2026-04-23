using TadaWy.Domain.Entities;

namespace TadaWy.Applicaation.DTO.AppointmentDTOs
{
    public class CreateAppointmentRequest
    {
        public string DoctorId { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }

    }
}

