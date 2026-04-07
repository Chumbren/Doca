namespace Doca.Server.DTOs
{

    public class DocumentDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime UpdatedAt { get; set; }

        public int? TemplateId { get; set; }
        public string? HeaderImage { get; set; }
        public string? FooterImage { get; set; }

        public List<DocumentVersionDto> Versions { get; set; } = new();
    }

    public class DocumentVersionDto
    {
        public int Id { get; set; }
        public int VersionNumber { get; set; }
        public string Content { get; set; } = "";
        public string ChangeDescription { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public string AuthorName { get; set; } = "";
    }
}
