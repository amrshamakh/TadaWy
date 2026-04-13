using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using TadaWy.Applicaation.IService;

namespace TadaWy.Infrastructure.Service
{
    public class ImageService : IImageService
    {
        private readonly ICloudinaryService _cloudinaryService;

        public ImageService(ICloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        public async Task<string> SaveDoctorImageAsync(IFormFile image, int doctorId)
        {
            return await _cloudinaryService.UploadFileAsync(image, "DoctorImages");
        }

        public async Task DeleteDoctorImageAsync(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return;

            // Extract publicId from Cloudinary URL (e.g., https://res.cloudinary.com/cloudname/image/upload/v1/folder/publicId.jpg)
            var uri = new Uri(imageUrl);
            var path = uri.AbsolutePath; // /cloudname/image/upload/v1/folder/publicId.jpg
            var segments = path.Split('/');
            var publicIdWithExtension = segments[^1];
            var publicId = Path.GetFileNameWithoutExtension(publicIdWithExtension);
            
            // If it's in a folder, we need the folder name too
            var folder = segments[^2];
            if (folder != "upload" && !folder.StartsWith("v"))
            {
                publicId = $"{folder}/{publicId}";
            }

            await _cloudinaryService.DeleteFileAsync(publicId);
        }
    }
}