using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.SettingDtos
{
    public class UpdateSettingsDto
    {
        public string? Theme { get; set; }
        public string? Language { get; set; }

        public bool? EmailNotifications { get; set; }

        public bool? AppointmentReminders { get; set; }
        public bool? NewBookingAlerts { get; set; }
    }
}
