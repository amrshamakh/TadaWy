using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TadaWy.Domain.Entities;

public class ChronicDiseaseConfiguration
    : IEntityTypeConfiguration<ChronicDisease>
{
    public void Configure(EntityTypeBuilder<ChronicDisease> builder)
    {
        builder.ToTable("ChronicDiseases");

        builder.HasKey(cd => cd.Id);

        builder.Property(cd => cd.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(cd => cd.Name)
            .IsUnique();
    }
}
