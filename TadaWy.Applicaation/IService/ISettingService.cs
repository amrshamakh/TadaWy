using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.ChangePasswordDTO;
using TadaWy.Applicaation.DTO.SettingDtos;

namespace TadaWy.Applicaation.IService
{
    public interface ISettingService
    {
        Task UpdateSettings(string userId, UpdateSettingsDto dto);
        Task ChangePassword(string userId, ChangePasswordDto dto);
        Task DeleteAccount(string userId);

    }
}
