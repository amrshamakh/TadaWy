using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.Entities
{
    public class AiBrainScan
    {
        public int Id { get; set; }

        public string UserId { get; set; } = default!;

        public string ImagePath { get; set; } = default!;

        public string? DescriptionEn { get; set; }
        public string? DescriptionAr { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
