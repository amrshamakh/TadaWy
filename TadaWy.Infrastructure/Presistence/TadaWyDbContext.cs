using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Applicaation.IServices;


namespace TadaWy.Infrastructure.Presistence
{
    public class TadaWyDbContext : IdentityDbContext<ApplicationUser>
    {

        public TadaWyDbContext(DbContextOptions<TadaWyDbContext> options) : base(options)
        {

        }
        public DbSet<Patient> Patients => Set<Patient>();
        public DbSet<ChronicDisease> ChronicDiseases => Set<ChronicDisease>();
        public DbSet<Allergy> Allergies => Set<Allergy>();
        public DbSet<PatientChronicDisease> PatientChronicDiseases => Set<PatientChronicDisease>();
        public DbSet<PatientAllergy> PatientAllergies => Set<PatientAllergy>();
        public DbSet<UserSettings> UserSettings => Set<UserSettings>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Doctor> Doctors => Set<Doctor>();
        public DbSet<DoctorWallet> DoctorWallets => Set<DoctorWallet>();
        public DbSet<WalletTransaction> walletTransactions => Set<WalletTransaction>();
        public DbSet<Specialization> Specializations => Set<Specialization>();
        public DbSet<DoctorSchedule> DoctorSchedules => Set<DoctorSchedule>();
        public DbSet<DoctorTimeSlot> DoctorTimeSlots => Set<DoctorTimeSlot>();
        public DbSet<DoctorReview> DoctorReviews => Set<DoctorReview>();
        public DbSet<AiBrainScan> AiBrainScans => Set<AiBrainScan>();
        public DbSet<Message> Messages => Set<Message>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(TadaWyDbContext).Assembly);
        }


    }
}
