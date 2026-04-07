using System.ComponentModel.DataAnnotations;

namespace Doca.Server.DTOs
{
    public class CreateTemplateDto
    {
        [Required, StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required, StringLength(500000)]
        public string Content { get; set; } = string.Empty;

        public string? HeaderImage { get; set; }
        public string? FooterImage { get; set; }
        public bool? IsPublic { get; set; }
    }

    public class UpdateTemplateDto
    {
        [StringLength(200)]
        public string? Name { get; set; }
        [StringLength(500)]
        public string? Description { get; set; }
        [StringLength(500000)]
        public string? Content { get; set; }
        public string? HeaderImage { get; set; }
        public string? FooterImage { get; set; }
        public bool? IsPublic { get; set; }
    }

    public class TemplateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? HeaderImage { get; set; }
        public string? FooterImage { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
    }
}
