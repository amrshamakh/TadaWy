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
    public class DoctorTimeSlotConfiguration : IEntityTypeConfiguration<DoctorTimeSlot>
    {
        public void Configure(EntityTypeBuilder<DoctorTimeSlot> builder)
        {
            builder.HasKey(ts => ts.Id);

            builder.Property(ts => ts.StartTime)
                   .IsRequired();

            builder.Property(ts => ts.EndTime)
                   .IsRequired();
        }
    }
}
