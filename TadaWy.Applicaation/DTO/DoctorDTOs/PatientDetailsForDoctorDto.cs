namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class PatientDetailsForDoctorDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public int Age { get; set; }
        public string? BloodType { get; set; }
        public List<string> Allergies { get; set; } = new();
        public List<string> ChronicDiseases { get; set; } = new();
    }
}
