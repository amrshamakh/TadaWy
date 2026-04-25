using Microsoft.AspNetCore.Http;
using TadaWy.Applicaation.DTO.Common;
using TadaWy.Applicaation.DTO.DoctorDTOs;

namespace TadaWy.Applicaation.IService
{
    public interface IDoctorService
    {
        Task<PagedResult<DoctorListDto>> GetDoctorsAsync(GetDoctorsRequest request);
        Task<DoctorDetailsDto?> GetDoctorByIdAsync(int id);
        Task<DoctorProfileDto> GetDoctorProfileAsync(string userId);
        Task UpdateDoctorProfileAsync(string userId, UpdateDoctorProfileDto updateDto);
        Task<string> UploadDoctorImageAsync(string userId, IFormFile image);

        Task<DoctorScheduleDto> GetDoctorScheduleAsync(string userId);
        Task UpdateDoctorScheduleAsync(string userId, UpdateDoctorScheduleDto dto);
        Task AddTimeSlotAsync(string userId, AddDoctorTimeSlotDto dto);
        Task<DoctorScheduleSummaryDto> GetDoctorWeeklySummaryAsync(string userId);
        Task<bool> CancelAppointmentAsync(int appointmentId, string userId);
        Task<bool> ConfirmAppointmentAsync(int appointmentId, string userId);
    }
}
