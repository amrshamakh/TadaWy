namespace TadaWy.Applicaation.DTO.SettingDtos
{
    public class SettingDto
    {
         public  string? Email { get; set; }
        public string? Id { get; set; }
        public string? Theme { get; set; }
        public string? Language { get; set; }

        public bool? EmailNotifications { get; set; }

        public bool? AppointmentReminders { get; set; }
        public bool? NewBookingAlerts { get; set; }
    }
}
