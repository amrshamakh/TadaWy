using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.DTO.AiDTOS
{
    public class AiBrainScanHistoryResponseDto
    {
        public List<AiBrainScanHistoryDto> Items { get; set; } = new();

        public bool HasMore { get; set; }
    }
}
