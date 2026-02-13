using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TadaWy.Domain.Entities;

public class PatientChronicDiseaseConfiguration
    : IEntityTypeConfiguration<PatientChronicDisease>
{
    public void Configure(EntityTypeBuilder<PatientChronicDisease> builder)
    {
        builder.ToTable("PatientChronicDiseases");

        builder.HasKey(pc => new { pc.PatientId, pc.ChronicDiseaseId });

        builder.HasOne(pc => pc.Patient)
            .WithMany(p => p.PatientChronicDiseases)
            .HasForeignKey(pc => pc.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pc => pc.ChronicDisease)
            .WithMany(cd => cd.PatientChronicDiseases)
            .HasForeignKey(pc => pc.ChronicDiseaseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
