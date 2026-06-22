using Microsoft.EntityFrameworkCore;
using TadaWy.Domain.Entities;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Seeders
{
    public static class ChronicDiseaseSeeder
    {
        public static async Task SeedChronicDiseasesAsync(TadaWyDbContext context)
        {
            // Check if seed data already exists
            if (await context.ChronicDiseases.AnyAsync(d => d.NameEn == "Diabetes Type 1")) return;

            var diseases = new List<ChronicDisease>
            {
                new ChronicDisease { NameEn = "Diabetes Type 1", NameAr = "السكري النوع الأول" },
                new ChronicDisease { NameEn = "Diabetes Type 2", NameAr = "السكري النوع الثاني" },
                new ChronicDisease { NameEn = "Hypertension", NameAr = "ارتفاع ضغط الدم" },
                new ChronicDisease { NameEn = "Asthma", NameAr = "الربو" },
                new ChronicDisease { NameEn = "Heart Disease", NameAr = "أمراض القلب" },
                new ChronicDisease { NameEn = "Chronic Kidney Disease", NameAr = "أمراض الكلى المزمنة" },
                new ChronicDisease { NameEn = "Hepatitis C", NameAr = "التهاب الكبد الوبائي سي" },
                new ChronicDisease { NameEn = "Hepatitis B", NameAr = "التهاب الكبد الوبائي بي" },
                new ChronicDisease { NameEn = "Rheumatoid Arthritis", NameAr = "التهاب المفاصل الروماتويدي" },
                new ChronicDisease { NameEn = "Osteoarthritis", NameAr = "التهاب المفاصل التنكسي" },
                new ChronicDisease { NameEn = "Epilepsy", NameAr = "الصرع" },
                new ChronicDisease { NameEn = "Thyroid Disorders", NameAr = "اضطرابات الغدة الدرقية" },
                new ChronicDisease { NameEn = "Anemia", NameAr = "فقر الدم" },
                new ChronicDisease { NameEn = "COPD", NameAr = "مرض الانسداد الرئوي المزمن" },
                new ChronicDisease { NameEn = "Depression", NameAr = "الاكتئاب" },
                new ChronicDisease { NameEn = "Anxiety Disorder", NameAr = "اضطراب القلق" },
                new ChronicDisease { NameEn = "Lupus", NameAr = "الذئبة الحمراء" },
                new ChronicDisease { NameEn = "Psoriasis", NameAr = "الصدفية" },
                new ChronicDisease { NameEn = "Irritable Bowel Syndrome", NameAr = "متلازمة القولون العصبي" },
                new ChronicDisease { NameEn = "Multiple Sclerosis", NameAr = "التصلب المتعدد" }
            };

            await context.ChronicDiseases.AddRangeAsync(diseases);
            await context.SaveChangesAsync();
        }
    }
}
