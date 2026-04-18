using CatalogOnline.DataAccess;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
     options.AddPolicy("FrontendPolicy", policy =>
     {
          policy.WithOrigins("http://localhost:5173") // No trailing slash
                .AllowAnyHeader()
                .AllowAnyMethod();
     });
});

CatalogOnline.DataAccess.DbSession.ConnectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

// CORS must be first, before UseHttpsRedirection
app.UseCors("FrontendPolicy");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();