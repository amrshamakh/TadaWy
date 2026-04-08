using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.Entities
{
    public class DoctorSchedule
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; } = default!;
        public DayOfWeek DayOfWeek { get; set; }
        public bool IsWorkingDay { get; set; }
        public ICollection<DoctorTimeSlot> TimeSlots { get; set; } = new List<DoctorTimeSlot>();
    }
}
