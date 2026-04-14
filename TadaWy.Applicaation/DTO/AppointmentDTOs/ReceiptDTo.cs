using TadaWy.Domain.ValueObjects;

namespace TadaWy.Applicaation.DTO.AppointmentDTOs
{
    public class ReceiptDTo
    {
        public string DoctorName { get; set; }
        public string PatientName { get; set; }
        public string PatientEmail { get; set; }
        public string Specialty { get; set; }
        public string PhoneNumber { get; set; }

        public decimal Price { get; set; }

        public Address DoctorLocation { get; set; }
        public string DoctorLocationDetails { get; set; }

        public DateTime ReceiptDate { get; set; } = DateTime.UtcNow;
        public DateTime Date { get; set; }
      
        public string PaymentMethod { get; set; }
    }
}
