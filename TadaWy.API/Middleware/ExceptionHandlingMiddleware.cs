using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Localization;
using TadaWy.Domain.Exceptions;

namespace TadaWy.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private readonly IStringLocalizer<ExceptionHandlingMiddleware> _localizer;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IStringLocalizer<ExceptionHandlingMiddleware> localizer)
        {
            _next = next;
            _logger = logger;
            _localizer = localizer;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException ex)
            {
                var message = _localizer[ex.Message];
                await HandleException(context, HttpStatusCode.NotFound, message);
            }
            catch (Exception ex)
            {
                // سجّل الـ exception كامل
                _logger.LogError(ex, "Unhandled exception");

                var message = _localizer["InternalServerError"];
                if (message.ResourceNotFound) message = new LocalizedString("InternalServerError", "An unexpected error occurred.");
                
                await HandleException(context, HttpStatusCode.InternalServerError, message);
            }
        }

        private static Task HandleException(HttpContext context, HttpStatusCode statusCode, string message)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var result = JsonSerializer.Serialize(new
            {
                success = false,
                message
            });

            return context.Response.WriteAsync(result);
        }
    }
}
