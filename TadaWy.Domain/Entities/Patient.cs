using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Enums;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Domain.Entities
{
    public class Patient
    {
        public int Id { get; set; }

        public ApplicationUser ApplicationUser { get; set; }

        [ForeignKey(nameof(ApplicationUser))]
        public string UserID { get; set; }
        public Gendre Gendre { get; set; }
        public DateOnly DateOfBirth { get; set; }
       

        [Required, MinLength(11), MaxLength(13)]
        
        public ICollection<ChronicDisease> ChronicDiseases { get; set; } = new List<ChronicDisease>(); 
        public ICollection <Appointment> Appointments { get; set; } = new List<Appointment>();
    }

    
}
