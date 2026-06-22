using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TadaWy.Domain.Entities;

namespace TadaWy.Infrastructure.Presistence.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.HasKey(n => n.Id);

            builder.Property(n => n.UserId)
                   .IsRequired()
                   .HasMaxLength(450);

            builder.Property(n => n.TitleEn)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(n => n.TitleAr)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(n => n.MessageEn)
                   .IsRequired()
                   .HasMaxLength(1000);

            builder.Property(n => n.MessageAr)
                   .IsRequired()
                   .HasMaxLength(1000);

            builder.Property(n => n.CreatedAt)
                   .IsRequired();

            builder.Property(n => n.IsRead)
                   .HasDefaultValue(false);

            // Index for fetching user notifications + filtering unread
            builder.HasIndex(n => new { n.UserId, n.IsRead });

            // Index for ordering by date (notification list)
            builder.HasIndex(n => new { n.UserId, n.CreatedAt });

            // Index for reminder dedup checks in AppointmentReminderJob
            builder.HasIndex(n => new { n.AppointmentId, n.Type });
        }
    }
}
