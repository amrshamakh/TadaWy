namespace TadaWy.Domain.Entities
{
        public class PatientChronicDisease
        {
            public int PatientId { get; set; }
            public Patient Patient { get; set; } = default!;

            public int ChronicDiseaseId { get; set; }
            public ChronicDisease ChronicDisease { get; set; } = default!;
        } 
}