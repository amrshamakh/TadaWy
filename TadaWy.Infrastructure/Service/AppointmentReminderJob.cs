using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class AppointmentReminderJob
    {
        private readonly TadaWyDbContext _context;
        private readonly INotificationService _notificationService;

        public AppointmentReminderJob(TadaWyDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task SendRemindersAsync()
        {
            var now = DateTime.UtcNow;

            // 1. Check for 12h Reminders
            var twelveHoursFromNow = now.AddHours(12);
            var app12h = await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.Status == AppointmentStatus.Pending &&
                            a.Date <= twelveHoursFromNow &&
                            a.Date > now.AddHours(11)) // Looking for appointments in the next hour's window (11-12h away)
                .ToListAsync();

            foreach (var app in app12h)
            {
                bool alreadySent = await _context.Notifications.AnyAsync(n => 
                    n.AppointmentId == app.Id && n.Type == NotificationType.AppointmentReminder12h);

                if (!alreadySent)
                {
                    await _notificationService.SendNotificationAsync(
                        app.PatientId,
                        "Upcoming Appointment Reminder",
                        $"You have an appointment with Dr. {app.Doctor.FirstName} {app.Doctor.LastName} in about 12 hours ({app.Date:t}).",
                        NotificationType.AppointmentReminder12h,
                        app.Id
                    );
                }
            }

            // 2. Check for 2h Reminders
            var twoHoursFromNow = now.AddHours(2);
            var app2h = await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.Status == AppointmentStatus.Pending &&
                            a.Date <= twoHoursFromNow &&
                            a.Date > now) // Any pending appointment in the next 2 hours
                .ToListAsync();

            foreach (var app in app2h)
            {
                bool alreadySent = await _context.Notifications.AnyAsync(n => 
                    n.AppointmentId == app.Id && n.Type == NotificationType.AppointmentReminder2h);

                if (!alreadySent)
                {
                    await _notificationService.SendNotificationAsync(
                        app.PatientId,
                        "Appointment Starting Soon",
                        $"Your appointment with Dr. {app.Doctor.FirstName} {app.Doctor.LastName} starts in less than 2 hours at {app.Date:t}!",
                        NotificationType.AppointmentReminder2h,
                        app.Id
                    );
                }
            }
        }
    }
}
