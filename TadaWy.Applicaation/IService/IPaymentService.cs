using TadaWy.Applicaation.DTO.PaymobDtos;
using TadaWy.Applicaation.DTO.WalletDtos;
using TadaWy.Domain.Entities;

namespace TadaWy.Applicaation.IService
{
    public interface IPaymentService
    {
        Task HandleSuccessfulPayment(int paymentId,string externalTransactionId,string externalOrderId);
        Task HandleFailedPayment(int paymentId);

        Task<string> CreateOrder(int paymentId);

        Task<string> GetPaymentKey(string orderId, Payment payment);

        string GenerateIframeUrl(string paymentToken);

        bool IsValidHmac(PaymobCallbackDto callback);

        Task<bool> RefundAsync(int paymentId);

        Task ReleaseDoctorBalancesAsync();

      
    }
}
