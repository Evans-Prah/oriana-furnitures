using DataAccess.Executors;
using DataAccess.Models;
using helpers.DbHelper;
using helpers.FileLogger;
using helpers.ProductsHelper;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var dbConnection = new DatabaseConnections();
builder.Configuration.Bind("Databases", dbConnection);


// Add services to the container.
builder.Services.AddSingleton(dbConnection);
builder.Services.AddScoped<IFileLogger, FileLogger>();
builder.Services.AddSingleton<IStoredProcedureExecutor, NpgsqlStoredProcedureExecutor>();
builder.Services.AddSingleton<IDbHelper, DbHelper>();
builder.Services.AddSingleton<IProductsHelper, ProductsHelper>();

builder.Services.AddCors();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x =>
{
    x.SwaggerDoc("v1", new OpenApiInfo { Title = "Oriana Furniture API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(x => x.SwaggerEndpoint("/swagger/v1/swagger.json", "Oriana Furniture API v1"));
}

app.UseStaticFiles();

app.UseRouting();

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
});

app.UseAuthorization();

app.MapControllers();

app.Run();
