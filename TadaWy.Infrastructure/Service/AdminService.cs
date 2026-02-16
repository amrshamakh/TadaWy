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
        public async Task<List<DoctorsIsNotApprovedDto>> GetDoctorNotApprovedAsync()
        {
            var result=await _TadaWyDbContext.Doctors.Where(d=>d.IsApproved==false).ToListAsync();

            var Doctors = new List<DoctorsIsNotApprovedDto>();
            foreach (var d in result)
            {
                Doctors.Add(new DoctorsIsNotApprovedDto
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    AddressDescription = d.AddressDescription,
                    VerificationDocumentPath = d.VerificationDocumentPath,
                    Address = d.Address,
                    IsApproved = d.IsApproved,
                    SpecializationId = d.SpecializationId,
                });
            }       
            
            return Doctors;
        }

        public async Task<bool> ApproveDoctorAsync(int DoctorId)
        {
            var result = await _TadaWyDbContext.Doctors.FirstOrDefaultAsync(d => d.Id == DoctorId);
            var User =await _userManager.FindByIdAsync(result.UserID);

            if(result == null)
            {
                return false;
            }

            result.IsApproved = true;
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

            result.IsRejected = true;
            result.RejectionReason = rejectionReason;
            await _TadaWyDbContext.SaveChangesAsync();
            await _emailService.SendEmail(User.Email, "please", "rejectionReason");
            return true;
        }

       
    }
}
