using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TadaWy.Domain.Entities;

public class SpecializationConfiguration
    : IEntityTypeConfiguration<Specialization>
{
    public void Configure(EntityTypeBuilder<Specialization> builder)
    {
        builder.ToTable("Specializations");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.NameEn)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(s => s.NameAr)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(s => s.NameEn)
            .IsUnique();

        builder.HasIndex(s => s.NameAr)
            .IsUnique();
    }
}