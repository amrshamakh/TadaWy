using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Enums;

namespace TadaWy.Applicaation.DTO.PatientDTOs
{
    public class UpdatePatientProfileDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? BloodType { get; set; }
        public Gendre? Gendre { get; set; }
        public DateOnly? DateOfBirth { get; set; }
    }
}
