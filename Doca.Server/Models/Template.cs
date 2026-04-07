using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Doca.Server.Models
{
    public class Template
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? HeaderImage { get; set; } 
        public string? FooterImage { get; set; }

        public bool IsPublic { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public int CreatedById { get; set; }

        [JsonIgnore]
        public User CreatedBy { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Document> Documents { get; set; } = new List<Document>();
    }
}
