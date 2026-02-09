using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Infrastructure.Seeders
{
    public static class RoleSeeder
    {
        public static async Task SeedRolesAsync(RoleManager<IdentityRole> RoleManager)
        {
          
            string[] roles = { "Admin", "Doctor","patient" };
            foreach (var roleName in roles)
            {
                if (!await RoleManager.RoleExistsAsync(roleName))
                {
                    await RoleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }
    }
}
