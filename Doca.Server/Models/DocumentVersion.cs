using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Doca.Server.Models
{
    public class DocumentVersion
    {
        [Key]
        public int Id { get; set; }

        public int VersionNumber { get; set; }

        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;

        public string ChangeDescription { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int DocumentId { get; set; }

        [JsonIgnore]
        public Document Document { get; set; } = null!;

        public int CreatedById { get; set; }

        [JsonIgnore]
        public User CreatedBy { get; set; } = null!;
    }
}
