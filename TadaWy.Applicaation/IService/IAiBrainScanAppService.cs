using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TadaWy.Applicaation.DTO.AiDTOS;

namespace TadaWy.Applicaation.IService
{
    public interface IAiBrainScanAppService
    {
        Task<UploadAiBrainScanResponseDto> UploadScanAsync(IFormFile file, string userId);
    }
}
