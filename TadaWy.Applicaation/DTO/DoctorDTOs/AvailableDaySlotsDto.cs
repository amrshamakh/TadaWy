using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class AvailableDaySlotsDto
    {
        public DateTime Date { get; set; }
        public List<AvailableSlotDto> Slots { get; set; } = new();
    }
}
