using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.IService;

namespace TadaWy.Infrastructure.Service
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }
        public async Task<string> SaveFileAsync(Stream stream, string fileName)
        {
            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            var uniqueName = Guid.NewGuid() + Path.GetExtension(fileName);
            var filePath = Path.Combine(uploadsFolder, uniqueName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await stream.CopyToAsync(fileStream);
            }
            return $"/uploads/{fileName}";
        }
    }
}
