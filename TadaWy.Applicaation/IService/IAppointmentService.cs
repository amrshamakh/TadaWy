using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AppointmentDTOs;
using TadaWy.Domain.Enums;

namespace TadaWy.Applicaation.IService
{
    public interface IAppointmentService
    {

        Task<ReceiptDTo> CreateOfflineAppointmentAndReturnReciptAsync(CreateAppointmentRequest request);

        Task<string> CreateOnlineAppointmentAsync(CreateAppointmentRequest request);


    }
}
