using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class UpdateDoctorProfileDto
    {
        public string ?FirstName { get; set; }
        public string ?LastName { get; set; }
       // public string Address { get; set; } = default!;
        public string? PhoneNumber { get; set; }

        public string? AddressDescription { get; set; }

        public string? Bio { get; set; }

        public decimal? Price { get; set; }
    }
}
