using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using TadaWy.Applicaation.IService;

namespace TadaWy.Infrastructure.Service
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment _env;

        public ImageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveDoctorImageAsync(IFormFile image, int doctorId)
        {
            var folder = Path.Combine(_env.WebRootPath, "images", "doctors");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = $"doctor-{doctorId}-{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";

            var path = Path.Combine(folder, fileName);

            using var stream = new FileStream(path, FileMode.Create);

            await image.CopyToAsync(stream);

            return $"/images/doctors/{fileName}";
        }

        public Task DeleteDoctorImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return Task.CompletedTask;

            var path = Path.Combine(_env.WebRootPath, imageUrl.TrimStart('/'));

            if (File.Exists(path))
            {
                File.Delete(path);
            }

            return Task.CompletedTask;
        }
    }

}