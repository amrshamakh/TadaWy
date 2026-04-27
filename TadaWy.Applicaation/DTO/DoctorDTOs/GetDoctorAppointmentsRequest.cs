using TadaWy.Domain.Entities;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class GetDoctorAppointmentsRequest
    {
        public DateTime? Day { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
    }
}
