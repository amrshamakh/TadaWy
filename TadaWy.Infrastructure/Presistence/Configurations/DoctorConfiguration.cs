using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities;

namespace TadaWy.Infrastructure.Presistence.Configurations
{
    public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
    {
        public void Configure(EntityTypeBuilder<Doctor> builder)
        {
            builder.HasKey(d => d.Id);

            builder.Property(d => d.UserID)
                   .IsRequired();

            builder.HasIndex(d => d.UserID)
                   .IsUnique();

            builder.Property(d => d.FirstName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(d => d.IsApproved)
                   .IsRequired();

            builder.Property(d => d.Rating)
                   .HasDefaultValue(0);

            builder.OwnsOne(d => d.Address, a =>
            {
                a.Property(p => p.Street).HasMaxLength(100);
                a.Property(p => p.City).HasMaxLength(50);
                a.Property(p => p.State).HasMaxLength(50);
            });
            builder.OwnsOne(d => d.Location, l =>
            {
                l.Property(p => p.Latitude);
                l.Property(p => p.Longitude);
            });
            builder.HasMany(d => d.Appointments)
                   .WithOne(a => a.Doctor)
                   .HasForeignKey(a => a.DoctorId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(d => d.Schedules)
                   .WithOne(s => s.Doctor)
                   .HasForeignKey(s => s.DoctorId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(d => d.Reviews)
                   .WithOne(r => r.Doctor)
                   .HasForeignKey(r => r.DoctorId)
                   .OnDelete(DeleteBehavior.Cascade);

            // علاقة Doctor ↔ Specialization 
            builder
            .HasOne(x => x.Specialization)
            .WithMany(s=>s.Doctors)
            .HasForeignKey(x => x.SpecializationId)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
