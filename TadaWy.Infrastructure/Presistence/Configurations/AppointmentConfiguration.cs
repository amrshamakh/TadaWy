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

            builder.Property(a => a.Date)
                   .IsRequired();

            builder.Property(a => a.Status)
                   .IsRequired();

            builder.Property(a => a.PaymentStatus)
                   .IsRequired();

            builder.HasOne(a => a.Payment)
                   .WithOne(p => p.Appointment)
                   .HasForeignKey<Payment>(p => p.AppointmentId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
