using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;
using TadaWy.Infrastructure.Presistence;
using TadaWy.Infrastructure.service;
using TadaWy.Infrastructure.Service;

namespace TadaWy.Infrastructure.Extensions
{
    public static class ServiceCollectionExtenstions
    {
        public static void AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<TadaWyDbContext>(obtions =>
            {
                obtions.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddScoped<ILookupService, LookupService>();
            services.AddHttpClient<IGeocodingService, OpenStreetMapGeocodingService>();
            services.AddScoped<IDoctorService,DoctorService>();
        }
    }
}