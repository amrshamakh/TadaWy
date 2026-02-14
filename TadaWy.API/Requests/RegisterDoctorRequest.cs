using TadaWy.Domain.Entities;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.API.Requests
{
    public class RegisterDoctorRequest
    {
        public string Email { get; set; }

        public string password { get; set; }

        public string ConfirmPassword { get; set; }

        public string? AddressDescription { get; set; }


        public int SpecializationId { get; set; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }


        public string FirstName { get; set; }
        public string LastName { get; set; }
        public IFormFile VerificationDocument { get; set; }
        public string PhoneNumber { get; set; }
    }
}
