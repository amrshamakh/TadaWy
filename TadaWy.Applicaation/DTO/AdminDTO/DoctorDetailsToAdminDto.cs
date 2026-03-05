using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Enums;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Applicaation.DTO.AdminDTO
{
    public class DoctorDetailsToAdminDto
    {
        public int Id { get; set; }
      
        public string DoctorName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; } = default!;
        public DoctorStatus Status { get; set; } = DoctorStatus.Pending;

        public double? Rating { get; set; }
        public int SpecializationId { get; set; }

        public string? RejectionReason { get; set; }
        public string? BannedReason { get; set; }

        public Address Address { get; set; } = default!;
        public string? AddressDescription { get; set; }

        public string VerificationDocumentPath { get; set; } = default!;
    }
}
