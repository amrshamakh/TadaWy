
namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
        public class GetDoctorsRequest
        {
            public string? Search { get; set; }
            public int? SpecializationId { get; set; }
            public double? MinRating { get; set; }
            public string? State { get; set; }
            public string? City { get; set; }

            public int PageNumber { get; set; } = 1;
            public int PageSize { get; set; } = 10;
        }
    }
