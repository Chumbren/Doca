using Doca.Server.Data;
using Doca.Server.DTOs;
using Doca.Server.Extensions;
using Doca.Server.Models;
using Doca.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Doca.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController(ISanitizerService sanitizer, AppDbContext context) : ControllerBase
    {
        private readonly AppDbContext _context = context;
        private readonly ISanitizerService _sanitizer = sanitizer;


        [HttpPost("{id}/versions")]
        public async Task<IActionResult> CreateVersion(int id, [FromBody] SaveVersionDto dto)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null) return NotFound(new { message = "Документ не найден" });

            var safeContent = _sanitizer.Sanitize(dto.Content);

            int currentUserId = User.GetCurrentUserId();

            var maxVersion = await _context.DocumentVersions
                .Where(v => v.DocumentId == id)
                .MaxAsync(v => (int?)v.VersionNumber) ?? 0;

            var newVersion = CreateDocumentVersion(id, dto.Content, dto.ChangeDescription, currentUserId, maxVersion + 1);

            _context.DocumentVersions.Add(newVersion);

            document.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDocument), new { id }, new
            {
                newVersion.Id,
                newVersion.VersionNumber
            });
        }

        [HttpGet]
        public IActionResult List()
        {
            var docs = _context.Documents
                .OrderByDescending(d => d.UpdatedAt)
                .Select(d => new { d.Id, d.Title, d.UpdatedAt })
                .ToList();
            return Ok(docs);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDocDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var uid = User.GetCurrentUserId();

            string initialContent = dto.InitialContent ?? "";
            string? headerImage = null;
            string? footerImage = null;
            int? templateId = dto.TemplateId;

            if (dto.TemplateId.HasValue)
            {
                var template = await _context.Templates
                    .FirstOrDefaultAsync(t => t.Id == dto.TemplateId && (t.IsPublic || t.CreatedById == uid));

                if (template != null)
                {
                    initialContent = template.Content;  
                    headerImage = template.HeaderImage;
                    footerImage = template.FooterImage;
                    templateId = template.Id;
                }
            }

            var doc = new Document
            {
                Title = dto.Title,
                CreatedById = uid,
                UpdatedAt = DateTime.UtcNow,
                TemplateId = templateId
            };

            var v1 = CreateDocumentVersion(doc.Id, initialContent, "Создание документа", uid, 1);
            doc.Versions.Add(v1);

            _context.Documents.Add(doc);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = doc.Id,
                headerImage,
                footerImage
            });
        }

        private DocumentVersion CreateDocumentVersion(int documentId, string content, string description, int createdById, int versionNumber)
        {
            return new DocumentVersion
            {
                DocumentId = documentId,
                VersionNumber = versionNumber,
                Content = _sanitizer.Sanitize(content), 
                ChangeDescription = description,
                CreatedById = createdById,
                CreatedAt = DateTime.UtcNow
            };
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocument(int id)
        {
            var document = await _context.Documents
                .Include(d => d.Versions.OrderByDescending(v => v.VersionNumber))
                .Include(d => d.Template) 
                .FirstOrDefaultAsync(d => d.Id == id);

            if (document == null)
                return NotFound(new { message = "Документ не найден" });

            var versionsList = document.Versions?.ToList() ?? [];

            var dto = new DocumentDto
            {
                Id = document.Id,
                Title = document.Title,
                UpdatedAt = document.UpdatedAt,
                TemplateId = document.TemplateId,  
                HeaderImage = document.Template?.HeaderImage,  
                FooterImage = document.Template?.FooterImage,
                Versions = [.. versionsList.Select(v => new DocumentVersionDto
        {
            Id = v.Id,
            VersionNumber = v.VersionNumber,
            Content = v.Content,
            ChangeDescription = v.ChangeDescription,
            CreatedAt = v.CreatedAt,
            AuthorName = v.CreatedBy?.Username ?? "Unknown"
        })]
            };

            return Ok(dto);
        }

    }
}