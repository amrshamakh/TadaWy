using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Enums;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Domain.Entities
{
    public class Patient
    {
        public int Id { get; set; }

        [Required]
        public string FName { get; set; }
        [Required]
        public string LName { get; set; }
        public Gendre Gendre { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public Address? Address { get; set; }

        [Required, MinLength(11), MaxLength(13)]
        public string PhoneNumber { get; set; }
        public string? Image { get; set; }
        public ICollection<ChronicDisease> ChronicDiseases { get; set; } = new List<ChronicDisease>();
        public ICollection <Appointment> Appointments { get; set; } = new List<Appointment>();
    }

    
}
