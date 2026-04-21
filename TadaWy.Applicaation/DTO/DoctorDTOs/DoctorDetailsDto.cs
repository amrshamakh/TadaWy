using TadaWy.Domain.ValueObjects;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Specialization { get; set; } = default!;
        public Address Address { get; set; } = default!;
        public string AddressDescription { get; set; } = default!;
        public double Rating { get; set; }
        public string PhoneNumber { get; set; } = default!;
        public decimal? Price { get; set; }
        public string? About { get; set; }
        public int YearsOfExperience { get; set; }
        public int ReviewsCount { get; set; }
        public List<AvailableDaySlotsDto> AvailableDaysSlots { get; set; } = new();
        public List<DoctorReviewDto> Reviews { get; set; } = new();
    }
}
