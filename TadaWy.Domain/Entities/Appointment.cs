using TadaWy.Domain.Enums;

namespace TadaWy.Domain.Entities
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

        public Patient Patient { get; set; }
        public Doctor Doctor { get; set; }
        public Payment? Payment { get; set; }

    }

}
