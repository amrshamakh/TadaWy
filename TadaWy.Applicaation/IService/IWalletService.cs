using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.WalletDtos;

namespace TadaWy.Applicaation.IService
{
    public interface IWalletService
    {
        Task<bool> RequestWithdrawalAsync(string doctorUserId, decimal amount);

        Task<DoctorDashboardWalletDto> GetDoctorDashboardAsync(string doctorUserId);
    }
}
