using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AiDTOS;

namespace TadaWy.Applicaation.IService
{
    public interface IAiBrainScanService
    {
        Task<UploadAiBrainScanResponseDto> AnalyzeAsync(string filePath);
    }
}
