using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Enums;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Applicaation.DTO.PatientDTOs
{
    public class PatientProfileDto
    {
        public int Id { get; set; }
        public string UserID { get; set; } = default!;

        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;

        public string Email { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;

        public Gendre Gendre { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? BloodType { get; set; }

        public Address? Address { get; set; }
    }
}
