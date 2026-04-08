namespace TadaWy.Applicaation.DTO.PatientDTOs
{
    public class AddReviewDto
    {
        public int DoctorId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
