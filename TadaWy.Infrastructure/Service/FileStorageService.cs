using System.IO;
using System.Threading.Tasks;
using TadaWy.Applicaation.IService;

namespace TadaWy.Infrastructure.Service
{
    public class FileStorageService : IFileStorageService
    {
        private readonly ICloudinaryService _cloudinaryService;

        public FileStorageService(ICloudinaryService cloudinaryService)
        {
            _cloudinaryService = cloudinaryService;
        }

        public async Task<string> SaveFileAsync(Stream stream, string fileName)
        {
            return await _cloudinaryService.UploadFileAsync(stream, fileName, "DoctorCvs");
        }
    }
}
