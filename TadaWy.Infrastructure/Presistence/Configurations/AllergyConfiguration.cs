using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TadaWy.Domain.Entities;

public class AllergyConfiguration
    : IEntityTypeConfiguration<Allergy>
{
    public void Configure(EntityTypeBuilder<Allergy> builder)
    {
        builder.ToTable("Allergies");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.NameEn)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(a => a.NameAr)
            .IsRequired()
            .HasMaxLength(150);

        builder.HasIndex(a => a.NameEn)
            .IsUnique();

        builder.HasIndex(a => a.NameAr)
            .IsUnique();
    }
}
