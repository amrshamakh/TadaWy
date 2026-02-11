using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace TadaWy.Domain.Entities.Identity
{
    public class ApplicationUser:IdentityUser
    {
        [Required, MaxLength(50)]
        public string FirstName { get; set; }
        [Required, MaxLength(50)]
        public string LastName { get; set; }

        public string PhoneNumber { get; set; }
        public string? Image { get; set; }
    }
}
