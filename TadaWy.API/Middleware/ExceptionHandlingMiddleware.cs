using System.Net;
using System.Text.Json;
using TadaWy.Domain.Exceptions;

namespace TadaWy.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException ex)
            {
                await HandleException(context, HttpStatusCode.NotFound, ex.Message);
            }
            catch (Exception ex)
            {
                // سجّل الـ exception كامل
                _logger.LogError(ex, "Unhandled exception");

                await HandleException(context, HttpStatusCode.InternalServerError, ex.Message);
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
