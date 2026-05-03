using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.ValueObjects;


namespace TadaWy.Applicaation.DTO.AuthDTO
{
    public class AuthRegisterDoctorDTO
    {
        public string Email { get; set; }

        public string password { get; set; }
        public string Confirmpassword { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
        public int SpecializationId { get; set; }
        public DateTime CareerStartDate { get; set; }
      
        public string? AddressDescriptionEn { get; set; }
        public string? AddressDescriptionAr { get; set; }

        public string FirstNameEn { get; set; }
        public string FirstNameAr { get; set; }
        public string LastNameEn { get; set; }
        public string LastNameAr { get; set; }
        public string? BioEn { get; set; }
        public string? BioAr { get; set; }
        public Stream FileStream { get; set; }
        public string FileName { get; set; }
        public string PhoneNumber { get; set; }

    }
}
