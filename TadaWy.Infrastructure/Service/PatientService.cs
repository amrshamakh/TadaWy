using Microsoft.EntityFrameworkCore;
using TadaWy.Applicaation.DTO.AppointmentDTOs;
using TadaWy.Applicaation.DTO.LookUpDTOs;
using TadaWy.Applicaation.DTO.PatientDTOs;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Enums;
using TadaWy.Domain.Exceptions;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class PatientService : IPatientService
    {
        private readonly TadaWyDbContext _context;
        private readonly INotificationService _notificationService;

        public PatientService(TadaWyDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
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

            // Recalculate doctor average rating
            var doctor = await _context.Doctors
                .Include(d => d.Reviews)
                .FirstOrDefaultAsync(d => d.Id == reviewDto.DoctorId);

            if (doctor != null)
            {
                doctor.Rating = doctor.Reviews.Any() 
                    ? Math.Round(doctor.Reviews.Average(r => r.Rating), 1) 
                    : 0;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<CalendarDayDto>> GetCalendarAsync(int month, int year, string patientId)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Payment)
                .Where(a => a.PatientId == patientId &&
                            a.Date.Month == month &&
                            a.Date.Year == year &&
                            a.Payment.Status!=PaymentStatus.Failed &&
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

        public async Task<List<AppointmentDto>> GetAppointmentsByDateAsync(DateTime date, string patientId)
        {
            return await _context.Appointments
                .Where(a => a.PatientId == patientId &&
                            a.Date.Date == date.Date)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    DoctorName = a.Doctor.FirstName + " " + a.Doctor.LastName,
                    Specialty = a.Doctor.Specialization.Name,
                    Date = a.Date,
                    Status = a.Status,
                    IsPaid = a.Payment != null ? a.Payment.Status : PaymentStatus.Pending
                })
                .ToListAsync();
            
        }

        public async Task<bool> CancelAppointmentAsync(int appointmentId, string patientId)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == appointmentId && a.PatientId == patientId);

            if (appointment == null)
                return false;

            if (appointment.Status == AppointmentStatus.Cancelled)
                return false;


            if (appointment.Date < DateTime.Now)
                return false;

            appointment.Status = AppointmentStatus.Cancelled;

            await _context.SaveChangesAsync();

            // Notify Patient
            await _notificationService.SendNotificationAsync(patientId, "Appointment Cancelled", $"Your appointment with Dr. {appointment.Doctor.FirstName} {appointment.Doctor.LastName} on {appointment.Date:f} has been cancelled.", NotificationType.AppointmentCancelled, appointment.Id);

            // Notify Doctor
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserID == patientId);
            string patientName = patient != null ? $"{patient.FirstName} {patient.LastName}" : "A patient";
            await _notificationService.SendNotificationAsync(appointment.Doctor.UserID, "Appointment Cancelled by Patient", $"{patientName} has cancelled their appointment on {appointment.Date:f}.", NotificationType.AppointmentCancelled, appointment.Id);

            return true;
        }
        public async Task<List<AppointmentDto>> GetPatientAppointmentsAsync(string patientId, AppointmentStatus status)
        {
            var query = _context.Appointments
                .Where(a => a.PatientId == patientId);

            query = query.Where(a => a.Status == status);

            return await query
                .OrderBy(a => a.Date)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
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
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.Specialization)
                .Include(a => a.Payment)
                .FirstOrDefaultAsync(a => a.Id == appointmentId)??throw new Exception("Appoiment not Found") ;

            var user = await _context.Users.FindAsync(appointment.PatientId);
            var patient = await _context.Patients.FirstOrDefaultAsync(i => i.UserID == appointment.PatientId);
            if (appointment == null)
                throw new Exception("Not Found");

            return new ReceiptDTo
            {
                ReceiptDate = DateTime.UtcNow,

                PatientName = patient.FirstName + " " + patient.LastName,
                PatientEmail =user.Email,

                DoctorName = appointment.Doctor.FirstName + " " + appointment.Doctor.LastName,
                Specialty = appointment.Doctor.Specialization.Name,

                DoctorLocation = appointment.Doctor.Address,
                DoctorLocationDetails = appointment.Doctor.AddressDescription??"",
                PhoneNumber = appointment.Doctor.PhoneNumber,

                Date = appointment.Date,

                PaymentMethod = appointment.Payment?.Method.ToString() ?? "Cash",

                Price = appointment.Payment?.Amount ?? 0
            };
        }
        public int GetPatientId(string userid)
        {
            var patient = _context.Patients.FirstOrDefault(p => p.UserID == userid);
            return patient == null ? 0 : patient.Id;
        }
    }
}
