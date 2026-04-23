using TadaWy.Domain.Enums;

namespace TadaWy.Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }

        public decimal Amount { get; set; }

        public PaymentStatus Status { get; set; }

        public PaymentMethod Method { get; set; }

        public string DoctorId { get; set; }

        public DateTime? PaymentDate { get; set; }  //online  and when doctor change status to paid
        public string? ExternalTransactionId { get; set; } //online
        public string? ExternalOrderId { get; set; }  //online 
        public decimal CommissionAmount { get; set; }  //online
        public decimal DoctorAmount { get; set; }  //online

        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
    }
    public enum PaymentMethod
    {
        Offline=0,
        Online=1
    }
}
