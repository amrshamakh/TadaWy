using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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

namespace TadaWy.Infrastructure.Services
{
    public class AiBrainScanAppService : IAiBrainScanAppService
    {
        private readonly IAiBrainScanService _aiService;
        private readonly TadaWyDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        public AiBrainScanAppService(
            IAiBrainScanService aiService,
            TadaWyDbContext context,
            UserManager<ApplicationUser> userManager,
            IWebHostEnvironment environment,
            IConfiguration configuration)
        {
            _aiService = aiService;
            _context = context;
            _userManager = userManager;
            _environment = environment;
            _configuration = configuration;
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
            var baseUrl = _configuration["AppSettings:BaseUrl"];

            return new UploadAiBrainScanResponseDto
            {
                ScanId = scan.Id,
                ImageUrl = $"{baseUrl}/BrainScans/{userId}/{scan.ImagePath}",
                Description = result.Description,
                CreatedAt = scan.CreatedAt
            };
        }

        /////////Get user's scan history/////////
        public async Task<AiBrainScanHistoryResponseDto> GetHistoryAsync(string userId, DateTime? lastCreatedAt)
        {
            var baseUrl = _configuration["AppSettings:BaseUrl"];

            var query = _context.AiBrainScans
                .Where(x => x.UserId == userId);

            if (lastCreatedAt.HasValue)
            {
                query = query.Where(x => x.CreatedAt < lastCreatedAt.Value);
            }

            var scans = await query
                .OrderByDescending(x => x.CreatedAt)
                .Take(6) 
                .Select(x => new AiBrainScanHistoryDto
                {
                    ImageUrl = $"{baseUrl}/BrainScans/{x.UserId}/{x.ImagePath}",
                    Description = x.Description,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            // Check if there are more items
            var hasMore = scans.Count > 5;

            // Remove extra item
            if (hasMore)
                scans.RemoveAt(5);

            // Reverse to chat order (old → new)
            scans.Reverse();

            return new AiBrainScanHistoryResponseDto
            {
                Items = scans,
                HasMore = hasMore
            };
        }
    }
}