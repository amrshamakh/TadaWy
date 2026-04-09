using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.LookUpDTOs;
using TadaWy.Applicaation.DTO.PatientDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Exceptions;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class PatientService : IPatientService
    {
        private readonly TadaWyDbContext _context;

        public PatientService(TadaWyDbContext context)
        {
            _context = context;
        }

        public async Task<PatientProfileDto> GetPatientProfileAsync(string userId)
        {
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserID == userId);

            if (patient == null)
                throw new NotFoundException("Patient not found");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
                throw new NotFoundException("User not found");

            return new PatientProfileDto
            {
                Id = patient.Id,
                UserID = patient.UserID,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                Email = user.Email ?? "",
                PhoneNumber = user.PhoneNumber ?? "",
                Gendre = patient.Gendre,
                DateOfBirth = patient.DateOfBirth,
                BloodType = patient.BloodType,
                Address = patient.Address
            };
        }

        public async Task UpdatePatientProfileAsync(string userId, UpdatePatientProfileDto updateDto)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserID == userId);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (patient == null || user == null)
                throw new NotFoundException("Patient or user not found");

            if (updateDto.FirstName != null) patient.FirstName = updateDto.FirstName;
            if (updateDto.LastName != null) patient.LastName = updateDto.LastName;
            if (updateDto.PhoneNumber != null) user.PhoneNumber = updateDto.PhoneNumber;
            if (updateDto.BloodType != null) patient.BloodType = updateDto.BloodType;
            if (updateDto.Gendre != null) patient.Gendre = updateDto.Gendre.Value;
            if (updateDto.DateOfBirth != null) patient.DateOfBirth = updateDto.DateOfBirth.Value;

            await _context.SaveChangesAsync();
        }

        public async Task<List<ChronicDiseaseDto>> GetPatientChronicDiseasesAsync(string userId)
        {
            var patient = await _context.Patients
                .Include(p => p.PatientChronicDiseases)
                .ThenInclude(pc => pc.ChronicDisease)
                .FirstOrDefaultAsync(p => p.UserID == userId);

            if (patient == null)
                throw new NotFoundException("Patient not found");

            return patient.PatientChronicDiseases.Select(pc => new ChronicDiseaseDto
            {
                Id = pc.ChronicDiseaseId,
                Name = pc.ChronicDisease.Name
            }).ToList();
        }

        public async Task AddPatientChronicDiseaseAsync(string userId, int chronicDiseaseId)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserID == userId);
            if (patient == null)
                throw new NotFoundException("Patient not found");

            if (!await _context.ChronicDiseases.AnyAsync(cd => cd.Id == chronicDiseaseId))
                throw new NotFoundException("Chronic disease not found");

            if (await _context.PatientChronicDiseases.AnyAsync(pc => pc.PatientId == patient.Id && pc.ChronicDiseaseId == chronicDiseaseId))
                return; // Already exists

            _context.PatientChronicDiseases.Add(new PatientChronicDisease
            {
                PatientId = patient.Id,
                ChronicDiseaseId = chronicDiseaseId
            });

            await _context.SaveChangesAsync();
        }

        public async Task RemovePatientChronicDiseaseAsync(string userId, int chronicDiseaseId)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserID == userId);
            if (patient == null)
                throw new NotFoundException("Patient not found");

            var link = await _context.PatientChronicDiseases
                .FirstOrDefaultAsync(pc => pc.PatientId == patient.Id && pc.ChronicDiseaseId == chronicDiseaseId);

            if (link != null)
            {
                _context.PatientChronicDiseases.Remove(link);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<AllergyDto>> GetPatientAllergiesAsync(string userId)
        {
            var patient = await _context.Patients
                .Include(p => p.PatientAllergies)
                .ThenInclude(pa => pa.Allergy)
                .FirstOrDefaultAsync(p => p.UserID == userId);

            if (patient == null)
                throw new NotFoundException("Patient not found");

            return patient.PatientAllergies.Select(pa => new AllergyDto
            {
                Id = pa.AllergyId,
                Name = pa.Allergy.Name
            }).ToList();
        }

        public async Task AddPatientAllergyAsync(string userId, int allergyId)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserID == userId);
            if (patient == null)
                throw new NotFoundException("Patient not found");

            if (!await _context.Allergies.AnyAsync(a => a.Id == allergyId))
                throw new NotFoundException("Allergy not found");

            if (await _context.PatientAllergies.AnyAsync(pa => pa.PatientId == patient.Id && pa.AllergyId == allergyId))
                return; // Already exists

            _context.PatientAllergies.Add(new PatientAllergy
            {
                PatientId = patient.Id,
                AllergyId = allergyId
            });

            await _context.SaveChangesAsync();
        }

        public async Task RemovePatientAllergyAsync(string userId, int allergyId)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserID == userId);
            if (patient == null)
                throw new NotFoundException("Patient not found");

            var link = await _context.PatientAllergies
                .FirstOrDefaultAsync(pa => pa.PatientId == patient.Id && pa.AllergyId == allergyId);

            if (link != null)
            {
                _context.PatientAllergies.Remove(link);
                await _context.SaveChangesAsync();
            }
        }

        public async Task SubmitReviewAsync(string userId, AddReviewDto reviewDto)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserID == userId);
            if (patient == null)
                throw new NotFoundException("Patient not found");

            if (!await _context.Doctors.AnyAsync(d => d.Id == reviewDto.DoctorId))
                throw new NotFoundException("Doctor not found");

            var review = new DoctorReview
            {
                PatientId = patient.Id,
                DoctorId = reviewDto.DoctorId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment
            };

            _context.DoctorReviews.Add(review);
            await _context.SaveChangesAsync();
        }
    }
}
