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
    public class PatientConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.UserID)
                   .IsRequired();

            builder.HasIndex(p => p.UserID)
                   .IsUnique();

            builder.Property(p => p.FirstName)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(p => p.LastName)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.OwnsOne(p => p.Address, a =>
            {
                a.Property(p => p.Street).HasMaxLength(100);
                a.Property(p => p.City).HasMaxLength(50);
                a.Property(p => p.State).HasMaxLength(50);
            });

            builder.HasMany(p => p.Appointments)
                   .WithOne(a => a.Patient)
                   .HasForeignKey(a => a.PatientId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany<ChronicDisease>("_chronicDiseases")
                    .WithMany()
                    .UsingEntity(j =>j.ToTable("PatientChronicDiseases"));

            builder.HasMany<Allergy>("_allergies")
                   .WithMany()
                   .UsingEntity(j => j.ToTable("PatientAllergies"));

        }
    }
}
