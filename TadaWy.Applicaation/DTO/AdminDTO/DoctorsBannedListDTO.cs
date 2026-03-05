using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Enums;

namespace TadaWy.Applicaation.DTO.AdminDTO
{
    internal class DoctorsBannedListDTO
    {
        public int Id { get; set; }
        public string DoctorName { get; set; } = default!;

        public double? Rating { get; set; }
        public DateTime BaanedAt { get; set; }
        public int SpecializationId { get; set; }
        public DoctorStatus Status { get; set; } = DoctorStatus.Pending;
    }
}
