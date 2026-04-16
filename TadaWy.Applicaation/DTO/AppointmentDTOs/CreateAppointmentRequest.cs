namespace TadaWy.Applicaation.DTO.AppointmentDTOs
{
    public class CreateAppointmentRequest
    {
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public DateTime Date { get; set; }
        public decimal Amount { get; set; } 
    }
}

