using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Domain.Entities
{
    public class Doctor
    {
        public int Id { get; set; }
        public string UserID { get; set; } = default!;

        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
<<<<<<< Updated upstream
<<<<<<< Updated upstream

        public bool IsApproved { get; set; }
=======
        public bool IsApproved { get; set; } = false;
>>>>>>> Stashed changes
        public string Specialization { get; set; }=default!;

<<<<<<< Updated upstream
        public Address Address { get; set; } = default!;
        public GeoLocation? Location { get; set; }
        public string? AddressDescription { get; set; }

        public double rating { get; set; }
=======
=======
        public bool IsApproved { get; set; } = false;
        public string Specialization { get; set; }=default!;
        public string Address { get; set; } = default!;
        public double rating { get; set; }

>>>>>>> Stashed changes
        public string VerificationDocumentPath { get; set; } = default!;
        public string UserID { get; set; } = default!;
>>>>>>> Stashed changes

        public ICollection<Appointment> Appointments { get; private set; }= new List<Appointment>();

        public ICollection<DoctorSchedule> Schedules { get; private set; }= new List<DoctorSchedule>();
        public ICollection<DoctorReview> Reviews { get; private set; }= new List<DoctorReview>();
    }
}
