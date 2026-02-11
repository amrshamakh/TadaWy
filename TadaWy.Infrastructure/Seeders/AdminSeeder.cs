using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities.Identity;

namespace TadaWy.Infrastructure.Seeders
{
    public static class AdminSeeder
    {
        public static async Task SeedAdminAsync(UserManager<ApplicationUser> userManager)
        {
            const string adminEmail = "admin@tadawy.com";
            const string adminPassword = "Admin@12345"; 

            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser != null) return; //seeded

            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create admin user");
            }

            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
    }
}

