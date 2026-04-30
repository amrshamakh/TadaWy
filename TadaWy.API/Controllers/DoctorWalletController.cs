using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorWalletController : ControllerBase
    {
        private readonly IWalletService _walletService;
        public DoctorWalletController(IWalletService walletService)
        {
            _walletService = walletService;
        }
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _walletService.GetDoctorDashboardAsync(userId);
            return Ok(result);
        }
        [HttpPost("withdraw")]
        public async Task<IActionResult> RequestWithdrawal([FromBody] decimal Amount)
        {
            if (Amount <= 0)
                return BadRequest("Amount must be greater than zero.");

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var success = await _walletService.RequestWithdrawalAsync(userId,Amount);

            if (!success)
                return BadRequest("Insufficient available balance.");

            return Ok("Withdrawal request submitted successfully.");
        }
    }
}
