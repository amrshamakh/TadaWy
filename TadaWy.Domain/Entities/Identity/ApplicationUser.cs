using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using TadaWy.Domain.Entities.AuthModels;

namespace TadaWy.Domain.Entities.Identity
{
    public class ApplicationUser:IdentityUser
    {
        public List<RefreshToken>? RefreshTokens { get; set; }
    }
}
