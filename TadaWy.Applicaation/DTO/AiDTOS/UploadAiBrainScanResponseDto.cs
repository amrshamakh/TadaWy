using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.AiDTOS
{
    public class UploadAiBrainScanResponseDto
    {
        public int ScanId { get; set; }
        public string ImageUrl { get; set; } = default!;
        public string Description { get; set; } = default!;

        public DateTime CreatedAt { get; set; }
    }
}
