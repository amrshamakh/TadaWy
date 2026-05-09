using Microsoft.EntityFrameworkCore;
using TadaWy.Domain.Entities;
using TadaWy.Infrastructure.Presistence;

namespace TadaWy.Infrastructure.Seeders
{
    public static class LocationSeeder
    {
        public static async Task SeedLocationsAsync(TadaWyDbContext context)
        {
            if (await context.States.AnyAsync()) return;

            var states = new List<State>
            {
                new State { NameEn = "Cairo", NameAr = "القاهرة", Cities = new List<City> 
                    { 
                        new City { NameEn = "Cairo", NameAr = "القاهرة" },
                        new City { NameEn = "Nasr City", NameAr = "مدينة نصر" },
                        new City { NameEn = "Maadi", NameAr = "المعادي" },
                        new City { NameEn = "Heliopolis", NameAr = "مصر الجديدة" }
                    } 
                },
                new State { NameEn = "Giza", NameAr = "الجيزة", Cities = new List<City> 
                    { 
                        new City { NameEn = "Giza", NameAr = "الجيزة" },
                        new City { NameEn = "6th of October", NameAr = "السادس من أكتوبر" },
                        new City { NameEn = "Sheikh Zayed City", NameAr = "مدينة الشيخ زايد" }
                    } 
                },
                new State { NameEn = "Alexandria", NameAr = "الإسكندرية", Cities = new List<City> 
                    { 
                        new City { NameEn = "Alexandria", NameAr = "الإسكندرية" },
                        new City { NameEn = "Borg El Arab", NameAr = "برج العرب" }
                    } 
                },
                new State { NameEn = "Dakahlia", NameAr = "الدقهلية", Cities = new List<City> 
                    { 
                        new City { NameEn = "Mansoura", NameAr = "المنصورة" }
                    } 
                },
                new State { NameEn = "Gharbia", NameAr = "الغربية", Cities = new List<City> 
                    { 
                        new City { NameEn = "Tanta", NameAr = "طنطا" }
                    } 
                }
            };

            await context.States.AddRangeAsync(states);
            await context.SaveChangesAsync();
        }
    }
}