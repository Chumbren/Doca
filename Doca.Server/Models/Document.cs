using System.Text.Json.Serialization;

namespace Doca.Server.Models
{
    public class Document
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public int CreatedById { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<DocumentVersion> Versions { get; set; } = [];
        public int? TemplateId { get; set; }

        [JsonIgnore]
        public Template? Template { get; set; }
    }

}
