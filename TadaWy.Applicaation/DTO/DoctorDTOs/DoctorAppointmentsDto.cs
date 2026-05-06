using TadaWy.Domain.Enums;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorAppointmentsDto
    {
        public int TotalAppointments { get; set; }
        public int ConfirmedCount { get; set; }
        public int PendingCount { get; set; }
        public int CancelledCount { get; set; }
        public List<AppointmentListItemDto> Appointments { get; set; } = new();
    }

    public class AppointmentListItemDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string PatientPhone { get; set; } = string.Empty;
        public PaymentMethod PaymentMethod { get; set; }
        public int DurationMinutes { get; set; }
        public DateTime AppointmentDate { get; set; }
        public AppointmentStatus Status { get; set; }
    }
}
