using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.IService
{
        public interface IImageService
        {
            Task<string> SaveDoctorImageAsync(IFormFile image, int doctorId);
            Task DeleteDoctorImageAsync(string imageUrl);
        }    
}
