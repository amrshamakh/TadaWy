using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace TadaWy.Applicaation.DTO.AiDTOS
{
    public class UploadAiBrainScanRequest
    {
        public IFormFile File { get; set; } = default!;

        public string UserId { get; set; } = default!;
    }
}
