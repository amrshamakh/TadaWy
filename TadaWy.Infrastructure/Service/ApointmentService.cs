using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AppointmentDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class ApointmentService:IAppointmentService
    {
        private readonly TadaWyDbContext _tadaWyDbContext;

        public ApointmentService(TadaWyDbContext tadaWyDbContext)
        {
           _tadaWyDbContext = tadaWyDbContext;
        }
        public async Task<List<CalendarDayDto>> GetCalendarAsync(int month, int year, int patientId)
        {
            var appointments = await _tadaWyDbContext.Appointments
                .Where(a => a.PatientId == patientId &&
                            a.Date.Month == month &&
                            a.Date.Year == year)
                .Select(a => a.Date.Date)
                .Distinct()
                .ToListAsync();

            return appointments.Select(date => new CalendarDayDto
            {
                Date = date,
                HasAppointments = true
            }).ToList();
        }

        public async Task<List<AppointmentDto>> GetAppointmentsByDateAsync(DateTime date, int patientId)
        {
            return await _tadaWyDbContext.Appointments
                .Where(a => a.PatientId == patientId &&
                            a.Date.Date == date.Date)
                .Select(a => new AppointmentDto
                {
                    DoctorName = a.Doctor.FirstName+a.Doctor.LastName,
                    Specialty = a.Doctor.Specialization.ToString(),
                    Date = a.Date,
                    Status = a.Status,
                    IsPaid = a.PaymentStatus
                })
                .ToListAsync();
        }

        public async Task<List<AppointmentDto>> GetPatientAppointmentsAsync(int patientId,AppointmentStatus status)
        {
            var query = _tadaWyDbContext.Appointments
                .Where(a => a.PatientId == patientId);

                query = query.Where(a => a.Status == status);

            return await query
                .OrderBy(a => a.Date)
                .Select(a => new AppointmentDto
                {
                    DoctorName = a.Doctor.FirstName + a.Doctor.LastName,
                    Specialty = a.Doctor.Specialization.ToString(),
                    Date = a.Date,
                    Status = a.Status,
                    IsPaid = a.PaymentStatus
                })
                .ToListAsync();
        }

        public int GetPatientId(string userid)
        {
            var patient = _tadaWyDbContext.Patients.FirstOrDefault(p => p.UserID == userid);
            return patient.Id;
        }
    }
}
