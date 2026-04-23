namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorReviewDto
    {
        public int Id { get; set; }
        public string PatientName { get; set; } = default!;
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
