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

        public TadaWyDbContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Doctor> Doctors => Set<Doctor>();
        public DbSet<Patient> Patients => Set<Patient>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<DoctorSchedule> DoctorSchedules => Set<DoctorSchedule>();
        public DbSet<DoctorReview> DoctorReviews => Set<DoctorReview>();
        public DbSet<Payment> Payments => Set<Payment>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(TadaWyDbContext).Assembly);
        }


    }
}
