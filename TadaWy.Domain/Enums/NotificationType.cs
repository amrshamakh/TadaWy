using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.Enums
{
    public enum NotificationType
    {
        AppointmentBooked = 1,
        AppointmentReminder = 2,
        AppointmentCancelled = 3,
        AppointmentReminder12h = 4,
        AppointmentReminder2h = 5
    }
}
