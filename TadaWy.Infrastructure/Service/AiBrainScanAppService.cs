using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AiDTOS;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Applicaation.Services
{
    public class AiBrainScanAppService : IAiBrainScanAppService
    {
        private readonly IAiBrainScanService _aiService;
        private readonly TadaWyDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _environment;

        public AiBrainScanAppService(
            IAiBrainScanService aiService,
            TadaWyDbContext context,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment environment)
        {
            _aiService = aiService;
            _context = context;
            _userManager = userManager;
            _environment = environment;
        }

        public async Task<UploadAiBrainScanResponseDto> UploadScanAsync(IFormFile file, string userId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required.");

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new UnauthorizedAccessException("Login to use AI.");

            //var uploadsFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "BrainScans");

            var userFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot","BrainScans", userId);

            if (!Directory.Exists(userFolder))
                Directory.CreateDirectory(userFolder);

            // Generate a unique file name to avoid conflicts
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(userFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Save scan record to database
            var scan = new AiBrainScan
            {
                UserId = userId,
                ImagePath = fileName,
                CreatedAt = DateTime.UtcNow
            };

            _context.AiBrainScans.Add(scan);
            await _context.SaveChangesAsync();

            var result = await _aiService.AnalyzeAsync(filePath);

            scan.Description = result.Description;

            await _context.SaveChangesAsync();

            return new UploadAiBrainScanResponseDto
            {
                ScanId = scan.Id,
                Description = result.Description,
                CreatedAt = scan.CreatedAt
            };
        }

        /////////Get user's scan history/////////
        public async Task<List<AiBrainScanHistoryDto>> GetHistoryAsync(string userId)
        {
            var scans = await _context.AiBrainScans
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.CreatedAt)
                .Select(x => new AiBrainScanHistoryDto
                {
                    ImagePath = x.ImagePath,
                    Description = x.Description,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return scans;
        }
    }
}