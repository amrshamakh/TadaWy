using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
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

            builder
               .Property(d => d.Price)
              .HasColumnType("decimal(18,2)");

            builder.HasIndex(d => d.UserID)
                   .IsUnique();

            builder.Property(d => d.FirstNameEn)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(d => d.FirstNameAr)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(d => d.LastNameEn)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(d => d.LastNameAr)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(d => d.BioEn)
                   .HasMaxLength(1000);

            builder.Property(d => d.BioAr)
                   .HasMaxLength(1000);

            builder.Property(d => d.AddressDescriptionEn)
                   .HasMaxLength(500);

            builder.Property(d => d.AddressDescriptionAr)
                   .HasMaxLength(500);

            builder.Property(d => d.Status)
                   .IsRequired();

            builder.Property(d => d.Rating)
                   .HasDefaultValue(0);

            builder.OwnsOne(d => d.Address, a =>
            {
                a.Property(p => p.Street).HasMaxLength(100);
                a.Property(p => p.City).HasMaxLength(50);
                a.Property(p => p.State).HasMaxLength(50);
                a.Property(p => p.StreetAr).HasMaxLength(100);
                a.Property(p => p.CityAr).HasMaxLength(50);
                a.Property(p => p.StateAr).HasMaxLength(50);
            });
            builder.OwnsOne(d => d.Location, l =>
            {
                l.Property(p => p.Latitude).IsRequired();
                l.Property(p => p.Longitude).IsRequired();
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
