using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
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
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IConfiguration _configuration;

        public AiBrainScanAppService(
            IAiBrainScanService aiService,
            TadaWyDbContext context,
            UserManager<ApplicationUser> userManager,
            ICloudinaryService cloudinaryService,
            IConfiguration configuration)
        {
            _aiService = aiService;
            _context = context;
            _userManager = userManager;
            _cloudinaryService = cloudinaryService;
            _configuration = configuration;
        }

        public async Task<UploadAiBrainScanResponseDto> UploadScanAsync(IFormFile file, string userId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is required.");

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                throw new UnauthorizedAccessException("Login to use AI.");

            // Upload to Cloudinary
            var imageUrl = await _cloudinaryService.UploadFileAsync(file, "AiImages");

            // Save scan record to database
            var scan = new AiBrainScan
            {
                UserId = userId,
                ImagePath = imageUrl, // Store full Cloudinary URL
                CreatedAt = DateTime.UtcNow
            };

            _context.AiBrainScans.Add(scan);
            await _context.SaveChangesAsync();

            // Analyze using the URL (assuming IAiBrainScanService.AnalyzeAsync can handle URLs)
            var result = await _aiService.AnalyzeAsync(imageUrl);

            scan.DescriptionEn = result.DescriptionEn;
            scan.DescriptionAr = result.DescriptionAr;

            await _context.SaveChangesAsync();

            return new UploadAiBrainScanResponseDto
            {
                ScanId = scan.Id,
                ImageUrl = imageUrl,
                DescriptionEn = result.DescriptionEn,
                DescriptionAr = result.DescriptionAr,
                CreatedAt = scan.CreatedAt
            };
        }

        /////////Get user's scan history/////////
        public async Task<AiBrainScanHistoryResponseDto> GetHistoryAsync(string userId, DateTime? lastCreatedAt)
        {
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
                    ImageUrl = x.ImagePath, // Path is already the full URL
                    DescriptionEn = x.DescriptionEn,
                    DescriptionAr = x.DescriptionAr,
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