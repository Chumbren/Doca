using Doca.Server.Data;
using Doca.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

string connectionString;
string db = "default";

if (args.Length > 0)
{
    db = args[0];
    connectionString = builder.Configuration.GetConnectionString(args[0]) 
        ?? throw new InvalidOperationException($"Строка подключения для базы данных '{db}' не определена в конфигураии."); ;
}
else
{
    throw new InvalidOperationException($"Отсутсвует параметр для определения базы данных.");
}


builder.Services.AddDbContext<AppDbContext>(opt =>
{
    switch (db)
    {
        case "mysql":
            opt.UseMySQL(
                connectionString + ";Old Guids=true;"
            );
            break;

        case "postgres":
            opt.UseNpgsql(connectionString);
            break;
        default:
            opt.UseMySQL(
                  connectionString + ";Old Guids=true;"
            );
            break;
    }
});



var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddSingleton<ISanitizerService, SanitizerService>();

builder.Services.AddCors(opt => opt.AddPolicy("AllowReact", p =>
    p.WithOrigins("https://localhost:49210") 
     .AllowAnyMethod()
     .AllowAnyHeader()
     .AllowCredentials()));

var app = builder.Build();

var uploadsPath = Path.Combine(app.Environment.WebRootPath, "uploads");
if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);

app.UseCors("AllowReact");
app.UseStaticFiles(); 
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");


app.Run();