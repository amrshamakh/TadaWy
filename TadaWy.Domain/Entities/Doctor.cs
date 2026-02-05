using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Domain.Entities
{
    public class Doctor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsApproved { get; set; }
        public string Specialization { get; set; }
        public Address Address { get; set; } = default!;
        public double rating { get; set; }

        public ICollection<Appointment> Appointments { get; private set; }= new List<Appointment>();

        public ICollection<DoctorSchedule> Schedules { get; private set; }= new List<DoctorSchedule>();
        public ICollection<DoctorReview> Reviews { get; private set; }= new List<DoctorReview>();
    }
}
