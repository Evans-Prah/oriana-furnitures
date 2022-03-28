using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.DependencyInjection;

namespace helpers.Extensions
{
    public static class SecurityMiddleware
    {
        public static IApplicationBuilder UseCustomSecurityConfig(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("X-Frame-Options", "DENY");
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Add("Referrer-Policy", "strict-origin");
                context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

                context.Response.Headers.Remove("X-AspNetVersion");
                context.Response.Headers.Remove("X-AspNetMvcVersion");

                context.Response.Headers.Add("Content-Security-Policy", "object-src 'none'; child-src 'none';");

                context.Response.Headers.Add("Feature-Policy",
                    "accelerometer 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; payment 'none'; usb 'none'");
                if (context.Response.Headers.ContainsKey("X-Powered-By") ||
                    context.Response.Headers.ContainsKey("x-powered-by"))
                {
                    context.Response.Headers.Remove("x-powered-by");
                    context.Response.Headers.Remove("X-Powered-By");
                }

                if (context.Response.Headers.ContainsKey("Server") || context.Response.Headers.ContainsKey("server"))
                {
                    context.Response.Headers.Remove("server");
                    context.Response.Headers.Remove("Server");
                }

                await next.Invoke();
            });

            return app;
        }

        public static IServiceCollection AddSecurityServices(this IServiceCollection services)
        {
            services.Configure<FormOptions>(r =>
            {
                r.ValueLengthLimit = int.MaxValue;
                r.MultipartBodyLengthLimit = int.MaxValue;
                r.MultipartHeadersLengthLimit = int.MaxValue;
            });
            return services;
        }
    }
}
