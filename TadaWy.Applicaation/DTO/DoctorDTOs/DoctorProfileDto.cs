using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorProfileDto
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string PhoneNumber { get; set; }= default!;
        public string Specialization { get; set; } = default!;

        public Address Address { get; set; } = default!;

        public string AddressDescription { get; set; } = default!;

        public string? Bio { get; set; }

        public decimal? Price { get; set; }

        public string? ImageUrl { get; set; }

        public double Rating { get; set; }
        public int ReviewsCount { get; set; }
        public int PatientsCount { get; set; }
        public int YearsOfExperience { get; set; }
        public List<DoctorReviewDto> Reviews { get; set; } = new();
    }
}
