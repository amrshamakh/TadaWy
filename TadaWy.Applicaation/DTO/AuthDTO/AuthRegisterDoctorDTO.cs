using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.ValueObjects;


namespace TadaWy.Applicaation.DTO.AuthDTO
{
    public class AuthRegisterDoctorDTO
    {
        public string Email { get; set; }

        public string password { get; set; }
       
        public string Specialization { get; set; }
        public Address Address { get; set; } = default!;

        public string FirstName { get; set; }
        [Required, MaxLength(50)]
        public string LastName { get; set; }

        public string PhoneNumber { get; set; }

    }
}
