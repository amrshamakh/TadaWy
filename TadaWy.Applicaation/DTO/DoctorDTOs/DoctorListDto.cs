
namespace TadaWy.Applicaation.DTO.DoctorDTOs
{

    public class DoctorListDto
    {
        public int Id { get; set; }
        public string DoctorName { get; set; } = default!;
        public double Rate { get; set; }
        public string Specialization { get; set; } = default!;
        public string? City { get; set; }
        public string? Street{ get; set; }
    }
}