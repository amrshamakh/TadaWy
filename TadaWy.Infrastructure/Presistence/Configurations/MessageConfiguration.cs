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
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {

            builder.HasKey(x => x.Id);

            builder.Property(x => x.SenderUserId)
                .IsRequired()
                .HasMaxLength(450);

            builder.Property(x => x.ReceiverUserId)
                .IsRequired()
                .HasMaxLength(450);

            builder.Property(x => x.Content)
                .HasMaxLength(1000);

            builder.Property(x => x.ImageUrl)
                .HasMaxLength(1000);

            builder.Property(x => x.CreatedAt)
                .IsRequired();

            builder.Property(x => x.IsSeen)
                .HasDefaultValue(false);


            builder.HasIndex(x => new { x.SenderUserId, x.ReceiverUserId });

            builder.HasIndex(x => x.CreatedAt);

            builder.HasIndex(x => new { x.SenderUserId, x.ReceiverUserId, x.CreatedAt });
        }
    }
}
