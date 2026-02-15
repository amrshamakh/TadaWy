using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Applicaation.DTO.AdminDTO
{
    public class DoctorsIsNotApprovedDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;

        public bool IsApproved { get; set; } = false;

        public int SpecializationId { get; set; }

        public Address Address { get; set; } = default!;
        public string? AddressDescription { get; set; }

        public string VerificationDocumentPath { get; set; } = default!;
    }
}
