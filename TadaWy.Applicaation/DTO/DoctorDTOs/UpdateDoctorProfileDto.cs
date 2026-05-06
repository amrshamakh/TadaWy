using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class UpdateDoctorProfileDto
    {
        public string ?FirstNameEn { get; set; }
        public string ?FirstNameAr { get; set; }
        public string ?LastNameEn { get; set; }
        public string ?LastNameAr { get; set; }
       // public string Address { get; set; } = default!;
        public string? PhoneNumber { get; set; }

        public string? AddressDescriptionEn { get; set; }
        public string? AddressDescriptionAr { get; set; }

        public string? BioEn { get; set; }
        public string? BioAr { get; set; }

        public decimal? Price { get; set; }

        public DateTime? CareerStartDate { get; set; }
    }
}
