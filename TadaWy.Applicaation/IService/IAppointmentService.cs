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
        Task<List<CalendarDayDto>> GetCalendarAsync(int month, int year, int patientId);

        Task<List<AppointmentDto>> GetAppointmentsByDateAsync(DateTime date, int patientId);

        Task<List<AppointmentDto>> GetPatientAppointmentsAsync(int patientId, AppointmentStatus status);

        Task<bool> CancelAppointmentAsync(int appointmentId, int patientId);

        int GetPatientId(string Userid);
    }
}
