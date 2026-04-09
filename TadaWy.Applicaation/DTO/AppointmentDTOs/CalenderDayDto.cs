using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.AppointmentDTOs
{
    public class CalendarDayDto
    {
        public DateTime Date { get; set; }
        public bool HasAppointments { get; set; }
    }
}
