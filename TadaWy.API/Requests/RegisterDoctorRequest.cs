using TadaWy.Domain.Entities;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.API.Requests
{
    public class RegisterDoctorRequest
    {
        public string Email { get; set; }

        public string password { get; set; }

        public string ConfirmPassword { get; set; }

        public string? AddressDescriptionEn { get; set; }
        public string? AddressDescriptionAr { get; set; }


        public int SpecializationId { get; set; }

        public DateTime CareerStartDate { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }


        public string FirstNameEn { get; set; }
        public string FirstNameAr { get; set; }
        public string LastNameEn { get; set; }
        public string LastNameAr { get; set; }
        public string? BioEn { get; set; }
        public string? BioAr { get; set; }
        public IFormFile VerificationDocument { get; set; }
        public string PhoneNumber { get; set; }
    }
}
