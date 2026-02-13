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
       
        public int SpecializationId { get; set; }
        public GeoLocation? Location { get; set; }
        public string? AddressDescription { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Stream FileStream { get; set; }
        public string FileName { get; set; }
        public string PhoneNumber { get; set; }

    }
}
