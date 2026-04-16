using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AppointmentDTOs;
using TadaWy.Applicaation.DTO.LookUpDTOs;
using TadaWy.Applicaation.DTO.PatientDTOs;
using TadaWy.Domain.Enums;

namespace TadaWy.Applicaation.IService
{
    public interface IPatientService
    {

        Task<List<CalendarDayDto>> GetCalendarAsync(int month, int year, int patientId);

        Task<List<AppointmentDto>> GetAppointmentsByDateAsync(DateTime date, int patientId);

        Task<List<AppointmentDto>> GetPatientAppointmentsAsync(int patientId, AppointmentStatus status);

        Task<bool> CancelAppointmentAsync(int appointmentId, int patientId);

        Task<ReceiptDTo> GetReceipt(int appointmentId);
        Task<PatientProfileDto> GetPatientProfileAsync(string userId);
        Task UpdatePatientProfileAsync(string userId, UpdatePatientProfileDto updateDto);

        Task<List<ChronicDiseaseDto>> GetPatientChronicDiseasesAsync(string userId);
        Task AddPatientChronicDiseaseAsync(string userId, int chronicDiseaseId);
        Task RemovePatientChronicDiseaseAsync(string userId, int chronicDiseaseId);

        Task<List<AllergyDto>> GetPatientAllergiesAsync(string userId);
        Task AddPatientAllergyAsync(string userId, int allergyId);
        Task RemovePatientAllergyAsync(string userId, int allergyId);

        Task SubmitReviewAsync(string userId, AddReviewDto reviewDto);

        int GetPatientId(string Userid);
    }
}
