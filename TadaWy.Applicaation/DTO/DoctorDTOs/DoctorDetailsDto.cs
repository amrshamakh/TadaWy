namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Specialization { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string AddressDescription { get; set; } = default!;
        public double Rating { get; set; }

        public List<AvailableDaySlotsDto> AvailableDaysSlots { get; set; } = new();
        public List<DoctorReviewDto> Reviews { get; set; } = new();
    }
}
