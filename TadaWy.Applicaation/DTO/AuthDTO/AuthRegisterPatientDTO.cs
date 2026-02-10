using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Enums;
using TadaWy.Domain.ValueObjects;


namespace TadaWy.Applicaation.DTO.AuthDTO
{
    public class AuthRegisterPatientDTO
    {
        public string Email { get; set; }

        public string password { get; set; }

        public Gendre Gendre { get; set; }

        public Address Address { get; set; } = default!;

        public string FirstName { get; set; }
     
        public string LastName { get; set; }

        public string PhoneNumber { get; set; }
        public DateOnly DateOfBirth { get; set; }
    }
}
