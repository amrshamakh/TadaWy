using System;
using System.Collections.Generic;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class UpdateDoctorScheduleDto
    {
        public int AppointmentDurationMinutes { get; set; }
        public decimal AppointmentPrice { get; set; }
        public List<WeeklyAvailabilityDto> WeeklyAvailability { get; set; } = new();
    }
}
