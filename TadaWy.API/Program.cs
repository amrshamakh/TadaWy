using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json;
using TadaWy.API.Hubs;
using TadaWy.API.Middleware;
using TadaWy.Applicaation.Extensions;
using TadaWy.Applicaation.IService;
using TadaWy.Domain.Entities.Identity;
using TadaWy.Domain.Helpers;
using TadaWy.Infrastructure.Extensions;
using TadaWy.Infrastructure.Presistence;
using TadaWy.Infrastructure.Seeders;
using TadaWy.Infrastructure.Service;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Localization;
using System.Globalization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
builder.Services.AddCors(options =>
{

    options.AddPolicy("AllowReactApp",
       policy =>
       {
           policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // Common React ports
                 .AllowAnyHeader()
                 .AllowAnyMethod()
                 .AllowCredentials();

       });

});

builder.Services.AddHangfire(x => x.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHangfireServer();
builder.Services.Configure<JWT>(builder.Configuration.GetSection("JWT"));
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.Configure<PaymobSettings>(builder.Configuration.GetSection("PaymobSettings"));
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<TadaWyDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddSignalR();
builder.Services.AddSingleton<IUserIdProvider, NameIdentifierUserIdProvider>();
builder.Services.AddScoped<INotificationHubService, NotificationHubService>();

// Customize the model validation error response for Simple messages Responses for Errors

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var firstError = context.ModelState
            .Values
            .SelectMany(v => v.Errors)
            .FirstOrDefault()?.ErrorMessage;

        return new BadRequestObjectResult(new
        {
            message = firstError
        });
    };
});


builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddApplicationServices();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "JWT Authorization header using the Bearer scheme"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "bearerAuth"
                            }
                        },
                        new string[] {}
                    }
                });
});

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"./keys"));
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.ASCII.GetBytes(builder.Configuration["JWT:Key"])
        ),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnChallenge = context =>
        {
            context.HandleResponse();

            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";

            var result = JsonSerializer.Serialize(new
            {
                success = false,
                message = "Unauthorized",
                errorCode = "UNAUTHORIZED"
            });

            return context.Response.WriteAsync(result);
        },

        OnForbidden = context =>
        {
            context.Response.StatusCode = 403;
            context.Response.ContentType = "application/json";

            var result = JsonSerializer.Serialize(new
            {
                success = false,
                message = "Access denied",
                errorCode = "FORBIDDEN"
            });

            return context.Response.WriteAsync(result);
        }
    };
}).AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"];
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

   
    options.CallbackPath = "/signin-google";
    options.SignInScheme = IdentityConstants.ExternalScheme;

    options.CorrelationCookie.SameSite = SameSiteMode.Lax;
    options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});




var app = builder.Build();

var supportedCultures = new[]
{
    new CultureInfo("en-US"),
    new CultureInfo("ar-EG"),
};

app.UseRequestLocalization(new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("en-US"),
    SupportedCultures = supportedCultures,
    SupportedUICultures = supportedCultures
});

//role ,admin seeding
using (var scope = app.Services.CreateScope())
{
    
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var context = scope.ServiceProvider.GetRequiredService<TadaWyDbContext>();
    await RoleSeeder.SeedRolesAsync(roleManager);
    await AdminSeeder.SeedAdminAsync(userManager);
  
    await SpecializationSeeder.SeedSpecializationsAsync(context);

  
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.All
});

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseStaticFiles();
app.UseCors("AllowReactApp");
app.UseResponseCaching();
app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard("/Dashboard");
app.MapControllers();
app.MapHub<ChatHub>("/chathub");
app.MapHub<NotificationHub>("/notificationhub");

// Schedule recurring job for appointment reminders
using (var scope = app.Services.CreateScope())
{
    var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();
    recurringJobManager.AddOrUpdate<AppointmentReminderJob>(
        "appointment-reminders",
        job => job.SendRemindersAsync(),
        Cron.Hourly() 
    );
    recurringJobManager.AddOrUpdate<IAppointmentService>(
      "mark-missed-appointments",
      job => job.MarkMissedAppointmentsAsync(),
      Cron.Hourly()
     );
     recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

    recurringJobManager.AddOrUpdate<IPaymentService>(
        "release-doctor-balances",
        job => job.ReleaseDoctorBalancesAsync(),
        Cron.Daily() 
    );
}


app.Run();
