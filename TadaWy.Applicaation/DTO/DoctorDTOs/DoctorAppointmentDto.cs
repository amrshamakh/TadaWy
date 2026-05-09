using System;
using TadaWy.Domain.Enums;

namespace TadaWy.Applicaation.DTO.DoctorDTOs
{
    public class DoctorAppointmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string Duration { get; set; }
        public string Status { get; set; }
        public string Payment { get; set; }
        public string? Phone { get; set; }
    }
}
