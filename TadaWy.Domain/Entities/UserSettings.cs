using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities.Identity;

namespace TadaWy.Domain.Entities
{
    public class UserSettings
    {
        public int Id { get; set; }
        public string UserId { get; set; }

        public ApplicationUser User { get; set; }

        public string Theme { get; set; } = "light";
        public string Language { get; set; } = "en";

        public bool EmailNotifications { get; set; } = true;

        public bool AppointmentReminders { get; set; } = true;
        public bool NewBookingAlerts { get; set; } = true;
    }
}
