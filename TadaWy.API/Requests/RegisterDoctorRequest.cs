using TadaWy.Domain.ValueObjects;

namespace TadaWy.API.Requests
{
    public class RegisterDoctorRequest
    {
        public string Email { get; set; }

        public string password { get; set; }

        public string Specialization { get; set; }
        public Address Address { get; set; } = default!;

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public IFormFile VerificationDocument { get; set; }
        public string PhoneNumber { get; set; }
    }
}
