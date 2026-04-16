using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.IService;

namespace TadaWy.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentsController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("{paymentId}/confirm-offline")]
        public async Task<IActionResult> ConfirmOffline(int paymentId)
        {
            await _paymentService.ConfirmOfflinePaymentAsync(paymentId);
            return Ok(new { message = "Offline payment confirmed." });
        }
    }
}
