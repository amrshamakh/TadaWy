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
                            a.Date > now.AddHours(11))
                .ToListAsync();

            if (app12h.Any())
            {
                // Batch: get all already-sent 12h reminder IDs in one query
                var app12hIds = app12h.Select(a => a.Id).ToList();
                var sentIds12h = await _context.Notifications
                    .Where(n => n.AppointmentId.HasValue &&
                                app12hIds.Contains(n.AppointmentId.Value) &&
                                n.Type == NotificationType.AppointmentReminder12h)
                    .Select(n => n.AppointmentId.Value)
                    .ToListAsync();

                // Batch: get all patient settings in one query
                var patientIds12h = app12h.Select(a => a.PatientId).Distinct().ToList();
                var settingsMap12h = await _context.UserSettings
                    .Where(s => patientIds12h.Contains(s.UserId))
                    .ToDictionaryAsync(s => s.UserId);

                foreach (var app in app12h.Where(a => !sentIds12h.Contains(a.Id)))
                {
                    settingsMap12h.TryGetValue(app.PatientId, out var settings);
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
                            a.Date > now)
                .ToListAsync();

            if (app2h.Any())
            {
                // Batch: get all already-sent 2h reminder IDs in one query
                var app2hIds = app2h.Select(a => a.Id).ToList();
                var sentIds2h = await _context.Notifications
                    .Where(n => n.AppointmentId.HasValue &&
                                app2hIds.Contains(n.AppointmentId.Value) &&
                                n.Type == NotificationType.AppointmentReminder2h)
                    .Select(n => n.AppointmentId.Value)
                    .ToListAsync();

                // Batch: get all patient settings in one query
                var patientIds2h = app2h.Select(a => a.PatientId).Distinct().ToList();
                var settingsMap2h = await _context.UserSettings
                    .Where(s => patientIds2h.Contains(s.UserId))
                    .ToDictionaryAsync(s => s.UserId);

                foreach (var app in app2h.Where(a => !sentIds2h.Contains(a.Id)))
                {
                    settingsMap2h.TryGetValue(app.PatientId, out var settings);
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
