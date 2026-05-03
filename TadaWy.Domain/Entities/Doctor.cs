using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Enums;
using TadaWy.Domain.ValueObjects;

namespace TadaWy.Domain.Entities
{
    public class Doctor
    {
        public int Id { get; set; }
        public string UserID { get; set; } = default!;

        public string FirstNameEn { get; set; } = default!;
        public string FirstNameAr { get; set; } = default!;
        public string LastNameEn { get; set; } = default!;
        public string LastNameAr { get; set; } = default!;
        public string PhoneNumber { get; set; } = default!;
        public string? ImageUrl { get; set; }
        public string? BioEn { get; set; }
        public string? BioAr { get; set; }
        public decimal? Price { get; set; }
        public int? AppointmentDurationMinutes { get; set; }
        public DateTime? CareerStartDate { get; set; }
        public DoctorStatus Status { get; set; } = DoctorStatus.Pending;

        public DateTime CreatedAt { get; set; }
        public DateTime? BannedAt { get; set; }
        public string? RejectionReason { get; set; }
        public string? BannedReason { get; set; }

        public int SpecializationId { get; set; }

        public Specialization Specialization { get; set; } = default!;

        public Address Address { get; set; } = default!;
        public GeoLocation Location { get; set; }
        public string? AddressDescriptionEn { get; set; }
        public string? AddressDescriptionAr { get; set; }

        public double Rating { get; set; }

        public string VerificationDocumentPath { get; set; } = default!;
    
        public ICollection<Appointment> Appointments { get; private set; }= new List<Appointment>();

        public ICollection<DoctorSchedule> Schedules { get; private set; }= new List<DoctorSchedule>();
        public ICollection<DoctorReview> Reviews { get; private set; }= new List<DoctorReview>();
    }
}
