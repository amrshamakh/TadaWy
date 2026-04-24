using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TadaWy.Applicaation.DTO.ChangePasswordDTO;
using TadaWy.Applicaation.DTO.SettingDtos;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;
using TadaWy.Infrastructure.Presistence;
using TadaWy.Infrastructure.service;
using TadaWy.Infrastructure.Service;

namespace TadaWy.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SettingController : ControllerBase
    {
        private readonly ISettingService _settingService;
        private readonly TadaWyDbContext _tadaWyDbContext;
        private readonly IAuthService _authService;
        public SettingController(ISettingService settingService,TadaWyDbContext tadaWyDbContext,IAuthService authService)
        {
            _settingService = settingService;
            _tadaWyDbContext = tadaWyDbContext;
            _authService = authService;

        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            var result=await _settingService.GetSettings(userId);
            return Ok(result);
        }

        [HttpPut]
        [Route("update")]
        public async Task<IActionResult> Update([FromBody] UpdateSettingsDto dto)
        {
            
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

           var result = await _settingService.UpdateSettings(userId, dto);

            return Ok(result); 
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var result = await _authService.ChangePasswordAsync(GetUserId(), dto);

            if (!result.IsAuthenticated)
            {
               
                return BadRequest(new { message = result.Messege });
            }
            return Ok(result);
        }

        [HttpDelete("DeleteAccount")]
        public async Task<IActionResult> Delete()
        {
            await _settingService.DeleteAccount(GetUserId());
            return Ok();
        }

        private string GetUserId()
        {
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new Exception("the User not Found");
            return userid;
        }
    }
}
