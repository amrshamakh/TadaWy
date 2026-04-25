using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TadaWy.Applicaation.IService;
using TadaWy.Applicaation.IServices;
using TadaWy.Domain.Entities;
using TadaWy.Infrastructure.Presistence;
using TadaWy.Infrastructure.service;
using TadaWy.Infrastructure.Service;
using TadaWy.Infrastructure.Services;

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
            services.AddHttpClient();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IFileStorageService, FileStorageService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<ILookupService, LookupService>();
            services.AddHttpClient<IGeocodingService, OpenStreetMapGeocodingService>();
            services.AddScoped<IDoctorService,DoctorService>();
            services.AddHttpClient<IAiBrainScanService, AiBrainScanService>();
            services.AddScoped<IAiBrainScanAppService, AiBrainScanAppService>();
            services.AddScoped<IImageService,ImageService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<IPatientService, PatientService>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddScoped<ICloudinaryService, CloudinaryService>();
            services.AddScoped<IAppointmentService, AppointmentService>();
            services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<ISettingService, SettingService>();
            services.AddScoped<IChatAppService, ChatAppService>();
            services.AddScoped<INotificationService, NotificationService>();
        }
    }
}