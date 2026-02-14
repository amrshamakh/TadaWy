using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace TadaWy.Domain.Entities
{
    public class AuthModel
    {
        public string Messege { get; set; }

        public List<string> Role { get; set; }

        public string Token { get; set; }

        public bool IsAuthenticated { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public DateTime ExpireOn { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }
        public DateTime RefreshTokenExpireOn { get; set; }
        public bool Success { get; set; }
    }
}
