using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorProfileDto
    {
        public int Id { get; set; }

        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string PhoneNumber { get; set; }= default!;
        public string Specialization { get; set; } = default!;

        public string Address { get; set; } = default!;

        public string AddressDescription { get; set; } = default!;

        public string? Bio { get; set; }

        public decimal? Price { get; set; }

        public string? ImageUrl { get; set; }
    }
}
