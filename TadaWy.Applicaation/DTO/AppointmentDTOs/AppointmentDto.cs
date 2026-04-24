using TadaWy.Domain.Entities;
using TadaWy.Domain.Enums;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Applicaation.DTO.AppointmentDTOs
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public string DoctorName { get; set; }
      
        public string Specialty { get; set; }
        public DateTime Date { get; set; }
        public AppointmentStatus Status { get; set; }
        public PaymentStatus IsPaid { get; set; }
    }
}

