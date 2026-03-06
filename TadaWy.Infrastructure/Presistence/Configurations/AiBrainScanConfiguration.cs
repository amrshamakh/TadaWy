using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TadaWy.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Infrastructure.Presistence.Configurations
{
    public class AiBrainScanConfiguration : IEntityTypeConfiguration<AiBrainScan>
    {
        public void Configure(EntityTypeBuilder<AiBrainScan> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.UserId)
                   .IsRequired();

            builder.Property(x => x.ImagePath)
                   .IsRequired()
                   .HasMaxLength(500);

            builder.Property(x => x.Description)
                   .HasMaxLength(200);

            builder.Property(x => x.CreatedAt)
                   .IsRequired();
        }
    }
}
