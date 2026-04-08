using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.Entities
{
    public class DoctorTimeSlot
    {
        public int Id { get; set; }
        public int DoctorScheduleId { get; set; }
        public DoctorSchedule DoctorSchedule { get; set; } = default!;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
