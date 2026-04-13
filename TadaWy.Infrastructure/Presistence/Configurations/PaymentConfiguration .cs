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
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Amount)
                   .IsRequired()
                   .HasColumnType("decimal(18,2)");

            builder.Property(p => p.PaymentDate)
                   .IsRequired(false); 

            builder.Property(p => p.Status)
                   .IsRequired();

            builder.Property(p => p.Method)
                   .IsRequired();

            builder.Property(p => p.ExternalOrderId)
                   .HasMaxLength(100);

            builder.Property(p => p.ExternalTransactionId)
                   .HasMaxLength(100);

            builder.HasIndex(p => p.ExternalOrderId); 
        }
    }
}
