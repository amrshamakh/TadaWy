using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.WalletDtos
{
    public class DoctorDashboardWalletDto
    {
        public decimal TotalBalance { get; set; }
        public decimal AvailableBalance { get; set; }

        public decimal OnlineEarningsThisMonth { get; set; }

        public List<RecentPaymentDto> RecentOnlinePayments { get; set; } = new();
    }
}
