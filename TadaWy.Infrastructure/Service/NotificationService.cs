using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.NotificationDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class NotificationService : INotificationService
    {
        private readonly TadaWyDbContext _context;
        private readonly INotificationHubService _hubService;

        public NotificationService(TadaWyDbContext context, INotificationHubService hubService)
        {
            _context = context;
            _hubService = hubService;
        }

        public async Task SendNotificationAsync(string userId, string titleEn, string titleAr, string messageEn, string messageAr, NotificationType type, int? appointmentId = null)
        {
            var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);
            if (settings != null && !settings.ApplicationNotifications)
                return;

            var notification = new Notification
            {
                UserId = userId,
                TitleEn = titleEn,
                TitleAr = titleAr,
                MessageEn = messageEn,
                MessageAr = messageAr,
                Type = type,
                AppointmentId = appointmentId,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");

            // Push to client via the abstraction
            await _hubService.SendNotificationAsync(userId, new NotificationDto
            {
                Id = notification.Id,
                Title = isArabic ? notification.TitleAr : notification.TitleEn,
                Message = isArabic ? notification.MessageAr : notification.MessageEn,
                Type = notification.Type,
                CreatedAt = notification.CreatedAt,
                IsRead = notification.IsRead,
                AppointmentId = notification.AppointmentId
            });
        }

        public async Task<List<NotificationDto>> GetUserNotificationsAsync(string userId)
        {
            var isArabic = CultureInfo.CurrentUICulture.Name.StartsWith("ar");
            return await _context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)
                .Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = isArabic ? n.TitleAr : n.TitleEn,
                    Message = isArabic ? n.MessageAr : n.MessageEn,
                    Type = n.Type,
                    CreatedAt = n.CreatedAt,
                    IsRead = n.IsRead,
                    AppointmentId = n.AppointmentId
                })
                .ToListAsync();
        }

        public async Task MarkAsReadAsync(int notificationId)
        {
            var notification = await _context.Notifications.FindAsync(notificationId);
            if (notification != null)
            {
                notification.IsRead = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task MarkAllAsReadAsync(string userId)
        {
            await _context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ExecuteUpdateAsync(n => n
                    .SetProperty(x => x.IsRead, true));
        }
    }
}
