using TadaWy.Domain.Enums;

namespace TadaWy.Domain.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; }
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

       
        public Payment? Payment { get; set; }

    }

    public enum TransactionType
    {
        Credit = 1, // فلوس داخلة
        Debit = 2   // فلوس خارجة
    }
}
