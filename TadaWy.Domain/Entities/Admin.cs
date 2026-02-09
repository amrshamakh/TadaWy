using System.ComponentModel.DataAnnotations.Schema;
using TadaWy.Domain.Entities.Identity;

namespace TadaWy.Domain.Entities
{
    public class Admin
    {
        public int Id { get; set; } 

        public string UserID { get; set; }
    }
}
