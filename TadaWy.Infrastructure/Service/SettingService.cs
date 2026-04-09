using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.ChangePasswordDTO;
using TadaWy.Applicaation.DTO.SettingDtos;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class SettingService:ISettingService
    {
        private readonly TadaWyDbContext _context;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

        public SettingService(TadaWyDbContext tadaWyDbContext, IPasswordHasher<ApplicationUser> passwordHasher)
        {
            _context = tadaWyDbContext;
            _passwordHasher = passwordHasher;
        }
        public async Task UpdateSettings(string userId, UpdateSettingsDto dto)
        {
            var settings = await _context.UserSettings
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (dto.Theme != null)
                settings.Theme = dto.Theme;

            if (dto.Language != null)
                settings.Language = dto.Language;

            if (dto.EmailNotifications.HasValue)
                settings.EmailNotifications = dto.EmailNotifications.Value;

            var user = await _context.Users.FindAsync(userId);

           
                if (dto.AppointmentReminders.HasValue)
                    settings.AppointmentReminders = dto.AppointmentReminders.Value;
           
                if (dto.NewBookingAlerts.HasValue)
                    settings.NewBookingAlerts = dto.NewBookingAlerts.Value;

            await _context.SaveChangesAsync();
        }

        public async Task ChangePassword(string userId, ChangePasswordDto dto)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                throw new Exception("User not found");

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.CurrentPassword
            );

            if (result == PasswordVerificationResult.Failed)
                throw new Exception("Wrong password");

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAccount(string userId)
        {
            var user = await _context.Users.FindAsync(userId);

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();
        }
    }
}
