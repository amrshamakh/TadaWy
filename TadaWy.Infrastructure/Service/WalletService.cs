using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.WalletDtos;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class WalletService: IWalletService
    {
        private readonly TadaWyDbContext _context;
        public WalletService(TadaWyDbContext tadaWyDbContext)
        {
            _context = tadaWyDbContext;
        }
        public async Task<bool> RequestWithdrawalAsync(string doctorUserId, decimal amount)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserID == doctorUserId)
                ?? throw new Exception("Doctor not found");

            var wallet = await _context.DoctorWallets
                .FirstOrDefaultAsync(w => w.DoctorId == doctor.Id);

            if (wallet == null || wallet.AvailableBalance < amount)
                return false;

            wallet.AvailableBalance -= amount;
            wallet.UpdatedAt = DateTime.UtcNow;

            _context.walletTransactions.Add(new WalletTransaction
            {
                DoctorId = doctor.Id,
                Amount = -amount,
                Type = TransactionType.Debit,
                Description = "Withdrawal request"
            });

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<DoctorDashboardWalletDto> GetDoctorDashboardAsync(string doctorUserId)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserID == doctorUserId)
                ?? throw new Exception("Doctor not found");

            var wallet = await _context.DoctorWallets
                .FirstOrDefaultAsync(w => w.DoctorId == doctor.Id);

            if (wallet == null)
            {
                wallet = new DoctorWallet
                {
                    DoctorId = doctor.Id,
                    TotalBalance = 0,
                    AvailableBalance = 0
                };
                _context.DoctorWallets.Add(wallet);
                await _context.SaveChangesAsync();
            }


            var now = DateTime.UtcNow;
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            var onlineThisMonth = await _context.Payments
                .Where(p => p.DoctorId == doctor.UserID &&
                            p.Method == PaymentMethod.Online &&
                            p.Status == PaymentStatus.Paid &&
                            p.PaymentDate >= startOfMonth)
                .SumAsync(p => (decimal?)p.DoctorAmount) ?? 0;


            var recentPayments = await _context.Payments
             .Include(p => p.Appointment)
             .Where(p => p.DoctorId == doctor.UserID &&
                  p.Method == PaymentMethod.Online &&
                  p.Status == PaymentStatus.Paid)
            .OrderByDescending(p => p.PaymentDate)
            .Take(10)
            .Join(_context.Patients,
            pay => pay.Appointment.PatientId,
            pat => pat.UserID,
            (pay, pat) => new RecentPaymentDto
            {
                Date = pay.PaymentDate ?? pay.Appointment.Date,
                PatientName = pat.FirstName + " " + pat.LastName,
                Amount = pay.Amount
            })
           .ToListAsync();
            return new DoctorDashboardWalletDto
            {
                TotalBalance = wallet.TotalBalance,
                AvailableBalance = wallet.AvailableBalance,
                OnlineEarningsThisMonth = onlineThisMonth,
                RecentOnlinePayments = recentPayments
            };
        }
    }
}
