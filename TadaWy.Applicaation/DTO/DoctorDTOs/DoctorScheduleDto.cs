using System;
using System.Collections.Generic;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorScheduleDto
    {
        public int AppointmentDurationMinutes { get; set; }
        public decimal AppointmentPrice { get; set; }
        public List<WeeklyAvailabilityDto> WeeklyAvailability { get; set; } = new();
    }

    public class WeeklyAvailabilityDto
    {
        public DayOfWeek DayOfWeek { get; set; }
        public bool IsWorkingDay { get; set; }
        public List<TimeSlotDto> TimeSlots { get; set; } = new();
    }

    public class TimeSlotDto
    {
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
