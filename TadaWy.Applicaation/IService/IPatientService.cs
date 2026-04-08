using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.LookUpDTOs;
using TadaWy.Applicaation.DTO.PatientDTOs;

namespace TadaWy.Applicaation.IService
{
    public interface IPatientService
    {
        Task<PatientProfileDto> GetPatientProfileAsync(string userId);
        Task UpdatePatientProfileAsync(string userId, UpdatePatientProfileDto updateDto);

        Task<List<ChronicDiseaseDto>> GetPatientChronicDiseasesAsync(string userId);
        Task AddPatientChronicDiseaseAsync(string userId, int chronicDiseaseId);
        Task RemovePatientChronicDiseaseAsync(string userId, int chronicDiseaseId);

        Task<List<AllergyDto>> GetPatientAllergiesAsync(string userId);
        Task AddPatientAllergyAsync(string userId, int allergyId);
        Task RemovePatientAllergyAsync(string userId, int allergyId);

        Task SubmitReviewAsync(string userId, AddReviewDto reviewDto);
    }
}
