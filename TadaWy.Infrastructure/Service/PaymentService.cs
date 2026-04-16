using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Runtime;
using System.Security.Cryptography;
using System.Text;
using TadaWy.Applicaation.DTO.PaymobDtos;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Enums;
using TadaWy.Domain.Helpers;
using TadaWy.Infrastructure.Presistence;
using System.Security.Cryptography;
using System.Text;
using TadaWy.Domain.PaymobResponse;

namespace TadaWy.Infrastructure.Service
{
    public class PaymentService : IPaymentService
    {

        private readonly TadaWyDbContext _context;
        private readonly PaymobSettings _settings;

        public PaymentService(TadaWyDbContext tadaWyDbContext, IOptions<PaymobSettings> options)
        {
            _context = tadaWyDbContext;
            _settings = options.Value;
        }
        public bool IsValidHmac(PaymobCallbackDto callback)
        {
            
            var secret = _settings.HmacSecret;
            if (string.IsNullOrEmpty(secret))
                return false;

            
            var parts = new List<string>
              {
             callback.Obj.AmountCents.ToString(),
             callback.Obj.Id.ToString(),
             callback.Obj.Order.MerchantOrderId,
             callback.Success ? "true" : "false"
           };

            var data = string.Join(string.Empty, parts); 

            
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(secret));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
            var calculatedHmac = BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();

            if (string.IsNullOrEmpty(callback.Hmac))
                return false;

            return calculatedHmac == callback.Hmac.ToLowerInvariant();
        }
        public async Task HandleSuccessfulPayment(int paymentId)
        {

            var payment = await _context.Payments
                .FirstOrDefaultAsync(x => x.Id == paymentId);

            if (payment == null || payment.Status == PaymentStatus.Paid)
                return;

            payment.Status = PaymentStatus.Paid;
            payment.PaymentDate = DateTime.UtcNow;

            payment.CommissionAmount = payment.Amount * 0.2m;
            payment.DoctorAmount = payment.Amount - payment.CommissionAmount;

            await AddToWallet(payment);

            await _context.SaveChangesAsync();
        }

        public async Task HandleFailedPayment(int paymentId)
        {
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.Id == paymentId);

            if (payment == null)
                return;

            if (payment.Status == PaymentStatus.Pending)
            {
                payment.Status = PaymentStatus.Failed;
                await _context.SaveChangesAsync();
            }
        }
        private async Task AddToWallet(Payment payment)
        {
            var wallet = await _context.DoctorWallets
                .FirstOrDefaultAsync(x => x.DoctorId == payment.DoctorId);

            if (wallet == null)
            {
                wallet = new DoctorWallet
                {
                    DoctorId = payment.DoctorId,
                    Balance = 0
                };
                _context.DoctorWallets.Add(wallet);
            }

            wallet.Balance += payment.DoctorAmount;

            var transaction = new WalletTransaction
            {
                DoctorId = payment.DoctorId,
                Amount = payment.DoctorAmount,
                Type = TransactionType.Credit,
                PaymentId = payment.Id,
                Description = "Payment added to wallet"
            };

            _context.walletTransactions.Add(transaction);
        }

        public async Task<string> GetAuthToken()  //send Api key(Scure) to paymob and recive token to use it to make orders
        {
            using var client = new HttpClient();

            var body = new
            {
                api_key = _settings.ApiKey
            };

            var response = await client.PostAsJsonAsync(
                "https://accept.paymob.com/api/auth/tokens",
                body
            );

            var result = await response.Content.ReadFromJsonAsync<AuthResponse>();

            return result.token;
        }

        public async Task<string> CreateOrder(int paymentId)  // to add order on paymob and return orderid and use it
        {
            var payment = await _context.Payments.FindAsync(paymentId);

            var token = await GetAuthToken();

            using var client = new HttpClient();

            var body = new
            {
                auth_token = token,
                delivery_needed = "false",
                amount_cents = (int)(payment.Amount * 100),
                currency = "EGP",
                merchant_order_id = payment.Id.ToString(),
                items = new object[] { }
            };

            var response = await client.PostAsJsonAsync(
                "https://accept.paymob.com/api/ecommerce/orders",
                body
            );

            var result = await response.Content.ReadFromJsonAsync<CreateOrderResponse>();

            return result.id;
        }

        public async Task<string> GetPaymentKey(string orderId, Payment payment) // send payment data(amount)and order id to recive token use it for pay
        {
            var token = await GetAuthToken();

            using var client = new HttpClient();

            var body = new
            {
                auth_token = token,
                amount_cents = (int)(payment.Amount * 100),
                expiration = 3600,
                order_id = orderId,
                billing_data = new
                {
                    first_name = "Test",
                    last_name = "User",
                    email = "test@test.com",
                    phone_number = "01000000000",
                    country = "EG",
                    city = "Cairo",
                    street = "Street",
                    building = "1",
                    floor = "1",
                    apartment = "1"
                },
                currency = "EGP",
                integration_id = _settings.IntegrationId
            };

            var response = await client.PostAsJsonAsync(
                "https://accept.paymob.com/api/acceptance/payment_keys",
                body
            );

            var result = await response.Content.ReadFromJsonAsync<PaymentKeyResponse>();

            return result.token;
        }

        public string GenerateIframeUrl(string paymentToken)  //use paymentToken to generate IframeUrl
        {
            return $"https://accept.paymob.com/api/acceptance/iframes/{_settings.IframeId}?payment_token={paymentToken}";
        }

        public async Task ConfirmOfflinePaymentAsync(int paymentId)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.Id == paymentId && p.Method == PaymentMethod.Offline);

            if (payment == null)
                throw new Exception("Payment not found.");

            if (payment.Status == PaymentStatus.Paid)
                return; 

            payment.Status = PaymentStatus.Paid;
            payment.PaymentDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}
