using TadaWy.Applicaation.DTO.PaymobDtos;
using TadaWy.Domain.Entities;

namespace TadaWy.Applicaation.IService
{
    public interface IPaymentService
    {
        Task HandleSuccessfulPayment(int paymentId);
        Task HandleFailedPayment(int paymentId);
        Task ConfirmOfflinePaymentAsync(int paymentId);

        Task<string> CreateOrder(int paymentId);

        Task<string> GetPaymentKey(string orderId, Payment payment);

        string GenerateIframeUrl(string paymentToken);

        bool IsValidHmac(PaymobCallbackDto callback);
    }
}
