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
                .Where(a => a.Status == AppointmentStatus.Upcoming &&
                            a.Date <= twelveHoursFromNow &&
                            a.Date > now.AddHours(11)) // Looking for appointments in the next hour's window (11-12h away)
                .ToListAsync();

            foreach (var app in app12h)
            {
                bool alreadySent = await _context.Notifications.AnyAsync(n => 
                    n.AppointmentId == app.Id && (n.Type == NotificationType.AppointmentReminder12h));

                if (!alreadySent)
                {
                    var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == app.PatientId);
                    var isArabic = settings?.Language == "ar";

                    await _notificationService.SendNotificationAsync(
                        app.PatientId,
                        isArabic ? "تذكير بموعد قادم" : "Upcoming Appointment Reminder",
                        isArabic ? "تذكير بموعد قادم" : "Upcoming Appointment Reminder",
                        isArabic ? $"لديك موعد مع دكتور {app.Doctor.FirstNameAr} {app.Doctor.LastNameAr} خلال 12 ساعة تقريباً ({app.Date:t})." : $"You have an appointment with Dr. {app.Doctor.FirstNameEn} {app.Doctor.LastNameEn} in about 12 hours ({app.Date:t}).",
                        isArabic ? $"لديك موعد مع دكتور {app.Doctor.FirstNameAr} {app.Doctor.LastNameAr} خلال 12 ساعة تقريباً ({app.Date:t})." : $"You have an appointment with Dr. {app.Doctor.FirstNameEn} {app.Doctor.LastNameEn} in about 12 hours ({app.Date:t}).",
                        NotificationType.AppointmentReminder12h,
                        app.Id
                    );
                }
            }

            // 2. Check for 2h Reminders
            var twoHoursFromNow = now.AddHours(2);
            var app2h = await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.Status == AppointmentStatus.Upcoming &&
                            a.Date <= twoHoursFromNow &&
                            a.Date > now) // Any pending appointment in the next 2 hours
                .ToListAsync();

            foreach (var app in app2h)
            {
                bool alreadySent = await _context.Notifications.AnyAsync(n => 
                    n.AppointmentId == app.Id && (n.Type == NotificationType.AppointmentReminder2h));

                if (!alreadySent)
                {
                    var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == app.PatientId);
                    var isArabic = settings?.Language == "ar";

                    await _notificationService.SendNotificationAsync(
                        app.PatientId,
                        isArabic ? "الموعد سيبدأ قريباً" : "Appointment Starting Soon",
                        isArabic ? "الموعد سيبدأ قريباً" : "Appointment Starting Soon",
                        isArabic ? $"موعدك مع دكتور {app.Doctor.FirstNameAr} {app.Doctor.LastNameAr} سيبدأ خلال أقل من ساعتين في {app.Date:t}!" : $"Your appointment with Dr. {app.Doctor.FirstNameEn} {app.Doctor.LastNameEn} starts in less than 2 hours at {app.Date:t}!",
                        isArabic ? $"موعدك مع دكتور {app.Doctor.FirstNameAr} {app.Doctor.LastNameAr} سيبدأ خلال أقل من ساعتين في {app.Date:t}!" : $"Your appointment with Dr. {app.Doctor.FirstNameEn} {app.Doctor.LastNameEn} starts in less than 2 hours at {app.Date:t}!",
                        NotificationType.AppointmentReminder2h,
                        app.Id
                    );
                }
            }
        }
    }
}
