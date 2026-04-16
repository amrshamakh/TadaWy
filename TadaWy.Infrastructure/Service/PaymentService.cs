using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;
using System.Runtime;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Enums;
using TadaWy.Domain.Helpers;
using TadaWy.Infrastructure.Presistence;

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

           // await AddToWallet(payment);

            await _context.SaveChangesAsync();
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
