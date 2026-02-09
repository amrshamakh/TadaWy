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
    public class DoctorScheduleConfiguration : IEntityTypeConfiguration<DoctorSchedule>
    {
        public void Configure(EntityTypeBuilder<DoctorSchedule> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.DayOfWeek)
                   .IsRequired();

            builder.Property(s => s.StartTime)
                   .IsRequired();

            builder.Property(s => s.EndTime)
                   .IsRequired();

            builder.HasIndex(s => new { s.DoctorId, s.DayOfWeek }); //give me the doctor schadule for monday it will be fast 
        }
    }
}