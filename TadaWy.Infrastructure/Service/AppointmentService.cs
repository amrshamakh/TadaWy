using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AppointmentDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class AppointmentService:IAppointmentService
    {
        private readonly TadaWyDbContext _tadaWyDbContext;
        private readonly IPatientService _patientService;

        public AppointmentService(TadaWyDbContext tadaWyDbContext,IPatientService patientService)
        {
           _tadaWyDbContext = tadaWyDbContext;
            _patientService = patientService;
        }
        public async Task<ReceiptDTo> CreateOfflineAppointmentAndReturnReciptAsync(CreateAppointmentRequest request)
        {
            
            var appointment = new Appointment
            {
                DoctorId = request.DoctorId,
                PatientId = request.PatientId,
                Date = request.Date,
                Status = AppointmentStatus.Pending   
            };

            _tadaWyDbContext.Appointments.Add(appointment);
            await _tadaWyDbContext.SaveChangesAsync();

            
            var payment = new Payment
            {
                AppointmentId = appointment.Id,
                DoctorId = request.DoctorId,
                Amount = request.Amount,
                Method = PaymentMethod.Offline,
                Status = PaymentStatus.Pending,
            };

            _tadaWyDbContext.Payments.Add(payment);
            await _tadaWyDbContext.SaveChangesAsync();

            return await _patientService.GetReceipt(appointment.Id);
        }
       
    }
}

