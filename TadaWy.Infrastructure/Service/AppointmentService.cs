using Azure.Core;
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
    public class AppointmentService : IAppointmentService
    {
        private readonly TadaWyDbContext _tadaWyDbContext;
        private readonly IPatientService _patientService;
        private readonly IPaymentService _paymentService;

        public AppointmentService(TadaWyDbContext tadaWyDbContext, IPatientService patientService, IPaymentService paymentService)
        {
            _tadaWyDbContext = tadaWyDbContext;
            _patientService = patientService;
            _paymentService = paymentService;
        }

        private async Task CheckAvilapleSlot(CreateAppointmentRequest request)
        {

            var doctor = await _tadaWyDbContext.Doctors
               .Include(d => d.Schedules).ThenInclude(s => s.TimeSlots)
               .FirstOrDefaultAsync(d => d.UserID == request.DoctorId) ?? throw new Exception("Doctor not found");

           
            int duration = doctor.AppointmentDurationMinutes ?? 20;

            var slotStart = request.Date;
            var slotEnd = slotStart.AddMinutes(duration);


            var date = slotStart.Date;
            var schedule = doctor.Schedules
                .FirstOrDefault(s => s.DayOfWeek == date.DayOfWeek && s.IsWorkingDay);

            if (schedule == null || !schedule.TimeSlots.Any())
                throw new Exception("Doctor is not working on this day.");


            bool withinWorkingHours = schedule.TimeSlots.Any(ts =>
            {
                var tsStart = date + ts.StartTime;
                var tsEnd = date + ts.EndTime;
                return slotStart >= tsStart && slotEnd <= tsEnd;
            });

            if (!withinWorkingHours)
                throw new Exception("Selected time is outside doctor's working hours.");
           

            bool isTaken = await _tadaWyDbContext.Appointments.AnyAsync(a =>
                a.DoctorId == doctor.Id &&
                a.Date >= slotStart &&
                a.Date < slotEnd
            );

            if (isTaken)
                throw new Exception("This slot is already booked.");
        }
        public async Task<ReceiptDTo> CreateOfflineAppointmentAndReturnReciptAsync(CreateAppointmentRequest request,string patientid)
        {
            var doctor = await _tadaWyDbContext.Doctors.FirstOrDefaultAsync(i => i.UserID == request.DoctorId) ?? throw new Exception("doctor not found");

            await CheckAvilapleSlot(request);
         
            var appointment = new Appointment
            {
                DoctorId = doctor.Id,
                PatientId = patientid,
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

        public async Task<string> CreateOnlineAppointmentAsync(CreateAppointmentRequest request,string patientid)
        {
            var doctor = await _tadaWyDbContext.Doctors.FirstOrDefaultAsync(i => i.UserID == request.DoctorId) ?? throw new Exception("doctor not found");

            await CheckAvilapleSlot(request);

            var appointment = new Appointment
            {
                DoctorId = doctor.Id,
                PatientId = patientid,
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
                Method = PaymentMethod.Online,
                Status = PaymentStatus.Pending,
            };

            _tadaWyDbContext.Payments.Add(payment);
            await _tadaWyDbContext.SaveChangesAsync();

            var orderId = await _paymentService.CreateOrder(payment.Id);

            var paymentKey = await _paymentService.GetPaymentKey(orderId, payment);

            var iframeUrl = _paymentService.GenerateIframeUrl(paymentKey);

            return iframeUrl;
        }

        
    }
}
