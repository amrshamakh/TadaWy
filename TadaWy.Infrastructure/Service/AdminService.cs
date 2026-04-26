using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AdminDTO;
using TadaWy.Applicaation.DTO.Common;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Enums;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class AdminService : IAdminService
    {
        private readonly TadaWyDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public AdminService(
            TadaWyDbContext db,
            UserManager<ApplicationUser> userManager,
            IEmailService emailService)
        {
            _db = db;
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task<PagedResult<DoctorListToAdmin>> GetDoctorsForAdminAsync(AdminGetDoctorsRequest request)
        {
            var query = _db.Doctors.AsNoTracking();

            
            if (request.Status.HasValue)
            {
                query = query.Where(d => d.Status == request.Status.Value);
            }

            
            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var search = request.Search.Trim();
                query = query.Where(d =>
                    d.FirstName.Contains(search) ||
                    d.LastName.Contains(search));
            }

            var projected = query.Select(d => new DoctorListToAdmin
            {
                Id = d.Id,
                DoctorName = d.FirstName + " " + d.LastName,
                SpecializationId = d.SpecializationId,
                Status = d.Status,
                CreatedAt = d.CreatedAt,
                Rating = d.Rating
            });

            var totalCount = await projected.CountAsync();

            var items = await projected
                .OrderByDescending(d => d.CreatedAt)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PagedResult<DoctorListToAdmin>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task<DoctorDetailsToAdminDto> GetDoctorById(int doctorId)
        {
            var doctor = await _db.Doctors
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == doctorId)
                ?? throw new Exception("Doctor not found");

            var user = await _userManager.FindByIdAsync(doctor.UserID)
                ?? throw new Exception("User not found");

            return new DoctorDetailsToAdminDto
            {
                Rating = doctor.Rating,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                DoctorName = doctor.FirstName + " " + doctor.LastName,
                Status = doctor.Status,
                SpecializationId = doctor.SpecializationId,
                Address = doctor.Address,
                AddressDescription = doctor.AddressDescription,
                Id = doctor.Id,
                VerificationDocumentPath = doctor.VerificationDocumentPath,
                RejectionReason = doctor.RejectionReason,
                BannedReason = doctor.BannedReason,
            };
        }

        public async Task<bool> ApproveDoctorAsync(int doctorId)
        {
            var doctor = await _db.Doctors
                .FirstOrDefaultAsync(d => d.Id == doctorId)
                ?? throw new Exception("Doctor not found");

            var user = await _userManager.FindByIdAsync(doctor.UserID)
                ?? throw new Exception("User not found");

            doctor.Status = DoctorStatus.Approved;
            doctor.RejectionReason = null;
            doctor.BannedReason = null;
            doctor.BannedAt = null;

            await _db.SaveChangesAsync();

            BackgroundJob.Enqueue(() =>
                _emailService.SendEmail(
                    user.Email,
                    "Doctor account approved",
                    "Your doctor account has been approved. You can now log in and start using Tadawy."));

            return true;
        }

        public async Task<bool> RejectDoctorAsync(int doctorId, string? rejectionReason)
        {
            var doctor = await _db.Doctors
                .FirstOrDefaultAsync(d => d.Id == doctorId)
                ?? throw new Exception("Doctor not found");

            var user = await _userManager.FindByIdAsync(doctor.UserID)
                ?? throw new Exception("User not found");

            doctor.Status = DoctorStatus.Rejected;
            doctor.RejectionReason = rejectionReason ?? string.Empty;
            doctor.BannedReason = null;
            doctor.BannedAt = null;

            await _db.SaveChangesAsync();

            BackgroundJob.Enqueue(() =>
                _emailService.SendEmail(
                    user.Email,
                    "Doctor registration rejected",
                    string.IsNullOrWhiteSpace(doctor.RejectionReason)
                        ? "Your registration was rejected."
                        : doctor.RejectionReason));

            return true;
        }

        public async Task<bool> BannDoctorAsync(int doctorId, string? banReason)
        {
            var doctor = await _db.Doctors
                .FirstOrDefaultAsync(d => d.Id == doctorId)
                ?? throw new Exception("Doctor not found");

            var user = await _userManager.FindByIdAsync(doctor.UserID)
                ?? throw new Exception("User not found");

            doctor.Status = DoctorStatus.Banned;
            doctor.BannedReason = banReason ?? string.Empty;
            doctor.BannedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            BackgroundJob.Enqueue(() =>
                _emailService.SendEmail(
                    user.Email,
                    "Doctor account banned",
                    string.IsNullOrWhiteSpace(doctor.BannedReason)
                        ? "Your account has been banned."
                        : doctor.BannedReason));

            return true;
        }

        public async Task<bool> UnbanDoctorAsync(int doctorId)
        {
            var doctor = await _db.Doctors.FindAsync(doctorId);
            if (doctor == null) return false;

            doctor.Status = DoctorStatus.Approved;
            doctor.BannedReason = null;
            doctor.BannedAt = null;

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<string?> GetDoctorCvUrlAsync(int doctorId)
        {
            var doctor = await _db.Doctors
                .AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == doctorId);

            return doctor?.VerificationDocumentPath;
        }
    }
}