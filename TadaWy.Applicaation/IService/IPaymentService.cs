namespace TadaWy.Applicaation.IService
{
    public interface IPaymentService
    {
        Task HandleSuccessfulPayment(int paymentId);
        Task ConfirmOfflinePaymentAsync(int paymentId);
    }
}
