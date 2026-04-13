using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.IService
{
    public interface ICloudinaryService
    {
        Task<string> UploadFileAsync(IFormFile file, string folder);
        Task<string> UploadFileAsync(Stream stream, string fileName, string folder);
        Task DeleteFileAsync(string publicId);
    }
}
