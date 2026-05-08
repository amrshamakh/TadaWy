using Microsoft.EntityFrameworkCore;
using TadaWy.Domain.Entities;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Seeders
{
    public static class SpecializationSeeder
    {
        public static async Task SeedSpecializationsAsync(TadaWyDbContext context)
        {
            if (await context.Specializations.AnyAsync()) return;

            var specializations = new List<Specialization>
            {
                new Specialization { NameEn = "Cardiology", NameAr = "القلب والأوعية الدموية" },
                new Specialization { NameEn = "Dermatology", NameAr = "الجلدية" },
                new Specialization { NameEn = "Pediatrics", NameAr = "الأطفال" },
                new Specialization { NameEn = "Orthopedics", NameAr = "العظام" },
                new Specialization { NameEn = "Ophthalmology", NameAr = "الرمد" },
                new Specialization { NameEn = "Neurology", NameAr = "المخ والأعصاب" },
                new Specialization { NameEn = "Psychiatry", NameAr = "الطب النفسي" },
                new Specialization { NameEn = "Dentistry", NameAr = "الأسنان" },
                new Specialization { NameEn = "Internal Medicine", NameAr = "الباطنة" },
                new Specialization { NameEn = "Obstetrics and Gynecology", NameAr = "النساء والتوليد" },
                new Specialization { NameEn = "Gastroenterology", NameAr = "الجهاز الهضمي والكبد" },
                new Specialization { NameEn = "Urology", NameAr = "المسالك البولية" },
                new Specialization { NameEn = "Otolaryngology (ENT)", NameAr = "الأنف والأذن والحنجرة" },
                new Specialization { NameEn = "Endocrinology", NameAr = "الغدد الصماء" },
                new Specialization { NameEn = "General Surgery", NameAr = "الجراحة العامة" }
            };

            await context.Specializations.AddRangeAsync(specializations);
            await context.SaveChangesAsync();
        }
    }
}