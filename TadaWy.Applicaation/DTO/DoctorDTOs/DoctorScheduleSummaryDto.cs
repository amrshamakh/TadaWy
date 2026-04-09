namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorScheduleSummaryDto
    {
        public int WorkingDaysCount { get; set; }
        public int TotalAppointmentsPerWeek { get; set; }
        public int AppointmentDurationMinutes { get; set; }
        public decimal AppointmentPrice { get; set; }
    }
}
