using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using TadaWy.Domain.Entities.AuthModels;

namespace TadaWy.Domain.Entities.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public ApplicationUser()
        {
            Settings = new UserSettings(); 
        }

        public ICollection<RefreshToken> RefreshTokens { get; set; }

        public UserSettings Settings { get; set; }  
    }
}
