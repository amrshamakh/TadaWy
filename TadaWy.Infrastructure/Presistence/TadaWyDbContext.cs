using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Applicaation.IServices;


namespace TadaWy.Infrastructure.Presistence
{
    public class TadaWyDbContext : IdentityDbContext<ApplicationUser>
    {

        public TadaWyDbContext(DbContextOptions options)
    : base(options)
        {
        }


    }
}
