using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TadaWy.Applicaation.DTO.PaymobDtos;
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

        [HttpPost("paymob-callback")]
        public async Task<IActionResult> PaymobCallback([FromForm] PaymobCallbackDto callback)
        {
            if (!_paymentService.IsValidHmac(callback))
                throw new UnauthorizedAccessException("Invalid HMAC");

            int paymentId = int.Parse(callback.Obj.Order.MerchantOrderId);
            if (callback.Success
                && callback.Obj != null
                && callback.Obj.Order != null)
            {
               

                await _paymentService.HandleSuccessfulPayment(paymentId);
               
            }
            else
            {
                await _paymentService.HandleFailedPayment(paymentId);
              
            }

            return Ok();

        }
    }
}
