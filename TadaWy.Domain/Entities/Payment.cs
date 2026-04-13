using TadaWy.Domain.Enums;

namespace TadaWy.Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }

        public decimal Amount { get; set; }
        public DateTime? PaymentDate { get; set; }

        public PaymentStatus Status { get; set; }

        public PaymentMethod Method { get; set; } 

        // Paymob fields
        public string? ExternalTransactionId { get; set; }
        public string? ExternalOrderId { get; set; }

        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
    }
    public enum PaymentMethod
    {
        Offline=0,
        Online=1
    }
}
