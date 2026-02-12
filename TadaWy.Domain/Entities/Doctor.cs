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
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public bool IsApproved { get; set; }
        public string Specialization { get; set; }=default!;
        public string Address { get; set; } = default!;
        public double rating { get; set; }

        public string UserID { get; set; } = default!;

        public ICollection<Appointment> Appointments { get; private set; }= new List<Appointment>();

        public ICollection<DoctorSchedule> Schedules { get; private set; }= new List<DoctorSchedule>();
        public ICollection<DoctorReview> Reviews { get; private set; }= new List<DoctorReview>();
    }
}
