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
    public class AppointmentService:IAppointmentService
    {
        private readonly TadaWyDbContext _tadaWyDbContext;

        public AppointmentService(TadaWyDbContext tadaWyDbContext)
        {
           _tadaWyDbContext = tadaWyDbContext;
        }
        public async Task<List<CalendarDayDto>> GetCalendarAsync(int month, int year, int patientId)
        {
            var appointments = await _tadaWyDbContext.Appointments
                .Where(a => a.PatientId == patientId &&
                            a.Date.Month == month &&
                            a.Date.Year == year &&
                            a.Status != AppointmentStatus.Cancelled) 
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
                    DoctorName = a.Doctor.FirstName + " " + a.Doctor.LastName,
                    Specialty = a.Doctor.Specialization.Name,
                    Date = a.Date,
                    Status = a.Status,
                    IsPaid = a.Payment != null ? a.Payment.Status : PaymentStatus.Pending
                })
                .ToListAsync();
        }

        public async Task<bool> CancelAppointmentAsync(int appointmentId, int patientId)
        {
            var appointment = await _tadaWyDbContext.Appointments
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patientId);

            if (appointment == null)
                return false;

            if (appointment.Status == AppointmentStatus.Cancelled)
                return false;

            
            if (appointment.Date < DateTime.Now)
                return false;

            appointment.Status = AppointmentStatus.Cancelled;

            await _tadaWyDbContext.SaveChangesAsync();

            return true;
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
                    DoctorName = a.Doctor.FirstName + " " + a.Doctor.LastName,
                    Specialty = a.Doctor.Specialization.Name,
                    Date = a.Date,
                    Status = a.Status,
                    IsPaid = a.Payment != null ? a.Payment.Status : PaymentStatus.Pending
                })
                .ToListAsync();
        }

        public async Task<ReceiptDTo> GetReceipt(int appointmentId)
        {
            var appointment = await _tadaWyDbContext.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.Specialization)
                .Include(a => a.Payment)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                throw new Exception("Not Found");

            return new ReceiptDTo
            {
                ReceiptDate = DateTime.UtcNow,

                PatientName = appointment.Patient.FirstName + " " + appointment.Patient.LastName,
                PatientEmail = appointment.Patient.User.Email,

                DoctorName = appointment.Doctor.FirstName + " " + appointment.Doctor.LastName,
                Specialty = appointment.Doctor.Specialization.Name,

                DoctorLocation = appointment.Doctor.Address,
                DoctorLocationDetails = appointment.Doctor.AddressDescription,
                PhoneNumber = appointment.Doctor.PhoneNumber,

                Date = appointment.Date,

                PaymentMethod = appointment.Payment?.Method.ToString() ?? "Cash",

                Price = appointment.Payment?.Amount ?? 0
            };
        }
        public int GetPatientId(string userid)
        {
            var patient = _tadaWyDbContext.Patients.FirstOrDefault(p => p.UserID == userid);
            return patient == null ? 0 : patient.Id;
        }
    }
}
