using API.Extensions;
using DataAccess.Executors;
using DataAccess.Models;
using helpers.AuthenticationHelper;
using helpers.BasketHelper;
using helpers.DbHelper;
using helpers.FileLogger;
using helpers.ProductsHelper;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var dbConnection = new DatabaseConnections();
builder.Configuration.Bind("Databases", dbConnection);


// Add services to the container.
builder.Services.AddSingleton(dbConnection);
builder.Services.ConfigureJWT(builder.Configuration);
builder.Services.AddScoped<IFileLogger, FileLogger>();
builder.Services.AddSingleton<IStoredProcedureExecutor, NpgsqlStoredProcedureExecutor>();
builder.Services.AddSingleton<IDbHelper, DbHelper>();
builder.Services.AddSingleton<IProductsHelper, ProductsHelper>();
builder.Services.AddSingleton<IBasketHelper, BasketHelper>();
builder.Services.AddSingleton<IAuthenticationHelper, AuthenticationHelper>();

builder.Services.AddCors();
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
{
    x.SwaggerDoc("v1", new OpenApiInfo { Title = "Oriana Furniture API", Version = "v1" });
    x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Jwt auth header",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    x.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    }); 
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(x => x.SwaggerEndpoint("/swagger/v1/swagger.json", "Oriana Furniture API v1"));
}

app.UseMiddleware<BearerTokenDecoderMiddleware>();

app.UseStaticFiles();

app.UseRouting();

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
