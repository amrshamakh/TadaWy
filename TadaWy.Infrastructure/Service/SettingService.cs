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
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Exceptions;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class SettingService:ISettingService
    {
        private readonly TadaWyDbContext _context;

        public SettingService(TadaWyDbContext tadaWyDbContext)
        {
            _context = tadaWyDbContext;
        }

        private async Task<UserSettings> SeedSettingAsync(string userId)
        {
            var settings = new UserSettings
            {
                UserId = userId,
                Theme = "light",
                Language = "ar",
                EmailNotifications = true,
                ApplicationNotifications = true
            };

            _context.UserSettings.Add(settings);
            await _context.SaveChangesAsync();

            return settings;
        }

        public async Task<SettingDto> GetSettings(string userId)
        {
            var user = await _context.Users
                .Include(x => x.Settings)
                .FirstOrDefaultAsync(x => x.Id == userId)
                ?? throw new NotFoundException("The user not found");

            var settings = user.Settings;

            if (settings == null)
                settings = await SeedSettingAsync(userId); 

            return new SettingDto
            {
                Theme = settings.Theme,
                Language = settings.Language,
                EmailNotifications = settings.EmailNotifications,
                ApplicationNotifications = settings.ApplicationNotifications,
                Email = user.Email,
                Id = user.Id
            };
        }

        public async Task<SettingDto> UpdateSettings(string userId, UpdateSettingsDto dto)
        {
            var user = await _context.Users
                .Include(x => x.Settings)
                .FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new NotFoundException("User not found");

            var settings = user.Settings;

            if (settings == null)
                settings = await SeedSettingAsync(userId);

            if (!string.IsNullOrWhiteSpace(dto.Theme))
                settings.Theme = dto.Theme;

            if (!string.IsNullOrWhiteSpace(dto.Language))
                settings.Language = dto.Language;

            if (dto.EmailNotifications.HasValue)
                settings.EmailNotifications = dto.EmailNotifications.Value;

            if (dto.ApplicationNotifications.HasValue)
                settings.ApplicationNotifications = dto.ApplicationNotifications.Value;

            await _context.SaveChangesAsync();

            return new SettingDto
            {
                Theme = settings.Theme,
                Language = settings.Language,
                EmailNotifications = settings.EmailNotifications,
                ApplicationNotifications = settings.ApplicationNotifications,
                Email = user.Email,
                Id = userId
            };
        }


        public async Task DeleteAccount(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return;

            var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);
            if (settings != null)
                _context.UserSettings.Remove(settings);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }
}
