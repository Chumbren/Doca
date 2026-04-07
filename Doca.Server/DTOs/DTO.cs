using System.ComponentModel.DataAnnotations;

namespace Doca.Server.DTOs
{
    public record AuthRegisterDto([Required] string Username, [Required, EmailAddress] string Email, [Required] string Password);
    public record AuthLoginDto([Required, EmailAddress] string Email, [Required] string Password);
    public record AuthResponseDto(string Token, string Username, int Id);
    public record CreateDocDto([Required, StringLength(255)] string Title, string? InitialContent, int? TemplateId);
    public record SaveVersionDto([Required] string Content, [Required] string ChangeDescription);
}
