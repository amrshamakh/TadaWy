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
        public string UserID { get; set; } = default!;

        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;

        public Gendre Gendre { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? BloodType { get; set; }

        public Address? Address { get; set; }
        public GeoLocation? Location { get; set; }

        public ICollection <Appointment> Appointments { get; set; } = new List<Appointment>();


        //public ICollection<ChronicDisease> PatientChronicDiseases { get; set; } = new List<ChronicDisease>();
        //public ICollection<Allergy> PatientAllergies { get; set; } = new List<Allergy>();



    }

    
}
