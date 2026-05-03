using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Enums;

namespace TadaWy.Applicaation.DTO.AdminDTO
{
    public class DoctorListToAdmin
    {
        public int Id { get; set; }
        public string DoctorNameEn { get; set; } = default!;
        public string DoctorNameAr { get; set; } = default!;

        public double? Rating { get; set; }
        public DateTime CreatedAt { get; set; }
        public int SpecializationId { get; set; }
        public DoctorStatus Status { get; set; } = DoctorStatus.Pending;
    }
}
