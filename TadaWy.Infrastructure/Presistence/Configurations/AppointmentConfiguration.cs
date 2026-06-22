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
    public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(a => a.Id);

            // Composite index for patient calendar/listing queries
            builder.HasIndex(a => new { a.PatientId, a.Date });

            // Composite index for doctor appointment queries
            builder.HasIndex(a => new { a.DoctorId, a.Date });

            // Index for missed appointment batch job + status filtering
            builder.HasIndex(a => new { a.Status, a.Date });

            builder.Property(a => a.Date)
                   .IsRequired();

            builder.Property(a => a.Status)
                   .IsRequired();



            builder.HasOne(a => a.Payment)
                   .WithOne(p => p.Appointment)
                   .HasForeignKey<Payment>(p => p.AppointmentId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
