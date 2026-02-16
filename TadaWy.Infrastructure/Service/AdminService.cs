using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AdminDTO;
using TadaWy.Applicaation.DTO.AuthDTO;
using TadaWy.Applicaation.DTO.Common;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;
using TadaWy.Domain.Entities.AuthModels;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Service
{
    public class AdminService : IAdminService
    {
        private TadaWyDbContext _TadaWyDbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public AdminService(TadaWyDbContext tadaWyDbContext, UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _TadaWyDbContext = tadaWyDbContext;
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task<PagedResult<DoctorListToAdmin>> GetDoctorsForAdminAsync(AdminGetDoctorsRequest request)
        {
            var query = _TadaWyDbContext.Doctors.AsNoTracking();

            
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
                CreatedAt = d.CreatedAt
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
        public async Task<DoctorDetailsToAdminDto> GetDoctorById(int DoctorId)
        {
            var result = await _TadaWyDbContext.Doctors.FirstOrDefaultAsync(d => d.Id == DoctorId);

            if (result is null)
                return new DoctorDetailsToAdminDto();

            return new DoctorDetailsToAdminDto
            {
                FirstName = result.FirstName,
                LastName = result.LastName,
                Status = result.Status,
                SpecializationId = result.SpecializationId,
                Address = result.Address,
                AddressDescription = result.AddressDescription,
                Id = result.Id,
                VerificationDocumentPath = result.VerificationDocumentPath,
            };
              
        }

        public async Task<bool> ApproveDoctorAsync(int DoctorId)
        {
            var result = await _TadaWyDbContext.Doctors.FirstOrDefaultAsync(d => d.Id == DoctorId);
            var User =await _userManager.FindByIdAsync(result.UserID);

            if(result == null)
            {
                return false;
            }

            result.Status = Domain.Enums.DoctorStatus.Pending;
            await _TadaWyDbContext.SaveChangesAsync();
            await _emailService.SendEmail(User.Email, "please", "i hack your email hahaha");
            return true;
        }

        public async Task<bool> RejectDoctorAsync(int DoctorId,string? rejectionReason)
        {
            var result = await _TadaWyDbContext.Doctors.FirstOrDefaultAsync(d => d.Id == DoctorId);
            var User = await _userManager.FindByIdAsync(result.UserID);

            if (result == null)
            {
                return false;
            }

            result.Status =Domain.Enums.DoctorStatus.Rejected;
            result.RejectionReason = rejectionReason;
            await _TadaWyDbContext.SaveChangesAsync();
            await _emailService.SendEmail(User.Email, "please", "rejectionReason");
            return true;
        }

       
    }
}
