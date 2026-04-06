using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.AiDTOS
{
    public class AiBrainScanHistoryDto
    {
        public string ImagePath { get; set; } = default!;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
