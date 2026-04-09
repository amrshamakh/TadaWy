using System;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class AddDoctorTimeSlotDto
    {
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
