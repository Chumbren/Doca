using Doca.Server.Data;
using Doca.Server.DTOs;
using Doca.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Doca.Server.Controllers
{
    [Route("api/auth"), ApiController]
    public class AuthController(AppDbContext db, IConfiguration config) : ControllerBase
    {
        private readonly AppDbContext _db = db;
        private readonly IConfiguration _config = config;

        [HttpPost("register")]
        public IActionResult Register([FromBody] AuthRegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (_db.Users.Any(u => u.Email == dto.Email))
                return BadRequest("Email уже зарегистрирован");

            var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User { Username = dto.Username, Email = dto.Email, PasswordHash = hash };
            _db.Users.Add(user);
            _db.SaveChanges();
            return Ok(new { message = "Успешная регистрация" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthLoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = _db.Users.FirstOrDefault(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Неверный email или пароль");

            var token = GenerateJwtToken(user);
            return Ok(new AuthResponseDto(token, user.Username, user.Id));
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpireHours"] ?? "24")),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
