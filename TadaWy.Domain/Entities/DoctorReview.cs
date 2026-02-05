namespace TadaWy.Domain.Entities
{
    public class DoctorReview
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; }=default!;
        public int PatientId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}