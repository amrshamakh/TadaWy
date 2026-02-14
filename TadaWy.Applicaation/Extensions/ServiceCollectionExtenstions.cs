using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
using TadaWy.Applicaation.DTO.AuthDTO.Validators;

namespace TadaWy.Applicaation.Extensions
{
    public static class ServiceCollectionExtenstions
    {
        public static void AddApplicationServices(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<AuthLoginValidator>();
            services.AddFluentValidationAutoValidation(); 
        }
    }
}
