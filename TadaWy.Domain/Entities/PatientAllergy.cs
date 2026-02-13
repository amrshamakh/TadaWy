namespace TadaWy.Domain.Entities
{
    public class PatientAllergy
    {
        public int PatientId { get; set; }
        public Patient Patient { get; set; } = default!;

        public int AllergyId { get; set; }
        public Allergy Allergy { get; set; } = default!;
    }
}