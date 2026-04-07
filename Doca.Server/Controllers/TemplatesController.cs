// Controllers/TemplatesController.cs
using Doca.Server.Data;
using Doca.Server.DTOs;
using Doca.Server.Extensions;
using Doca.Server.Models;
using Doca.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Doca.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TemplatesController(ISanitizerService sanitizer, AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;
    private readonly ISanitizerService _sanitizer = sanitizer;

    // GET: api/templates
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] bool? mine = null)
    {
        var userId = User.GetCurrentUserId();
        var query = _context.Templates.AsQueryable();

        if (mine == true)
            query = query.Where(t => t.CreatedById == userId);
        else if (mine != false) // null или true
            query = query.Where(t => t.IsPublic || t.CreatedById == userId);

        var templates = await query
            .OrderByDescending(t => t.UpdatedAt)
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.Description,
                t.IsPublic,
                t.UpdatedAt,
                AuthorName = t.CreatedBy.Username
            })
            .ToListAsync();

        return Ok(templates);
    }

    // GET: api/templates/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var userId = User.GetCurrentUserId();
        var template = await _context.Templates
            .Include(t => t.CreatedBy)
            .FirstOrDefaultAsync(t => t.Id == id && (t.IsPublic || t.CreatedById == userId));

        if (template == null) return NotFound(new { message = "Шаблон не найден" });

        return Ok(new TemplateDto
        {
            Id = template.Id,
            Name = template.Name,
            Description = template.Description,
            Content = template.Content,
            HeaderImage = template.HeaderImage,
            FooterImage = template.FooterImage,
            IsPublic = template.IsPublic,
            CreatedAt = template.CreatedAt,
            UpdatedAt = template.UpdatedAt,
            AuthorName = template.CreatedBy.Username
        });
    }

    // POST: api/templates
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTemplateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var userId = User.GetCurrentUserId();
        var sanitized = _sanitizer.Sanitize(dto.Content);

        var template = new Template
        {
            Name = dto.Name,
            Description = dto.Description,
            Content = sanitized,
            HeaderImage = dto.HeaderImage,
            FooterImage = dto.FooterImage,
            IsPublic = dto.IsPublic ?? false,
            CreatedById = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Templates.Add(template);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = template.Id }, new { template.Id, template.Name });
    }

    // PUT: api/templates/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTemplateDto dto)
    {
        var userId = User.GetCurrentUserId();
        var template = await _context.Templates
            .FirstOrDefaultAsync(t => t.Id == id && t.CreatedById == userId);

        if (template == null) return NotFound(new { message = "Шаблон не найден или нет прав" });

        if (!string.IsNullOrEmpty(dto.Name)) template.Name = dto.Name;
        if (dto.Description != null) template.Description = dto.Description;
        if (dto.Content != null) template.Content = _sanitizer.Sanitize(dto.Content);
        if (dto.HeaderImage != null) template.HeaderImage = dto.HeaderImage;
        if (dto.FooterImage != null) template.FooterImage = dto.FooterImage;
        if (dto.IsPublic.HasValue) template.IsPublic = dto.IsPublic.Value;

        template.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { template.Id, template.Name, template.UpdatedAt });
    }

    // DELETE: api/templates/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.GetCurrentUserId();
        var template = await _context.Templates
            .FirstOrDefaultAsync(t => t.Id == id && t.CreatedById == userId);

        if (template == null) return NotFound(new { message = "Шаблон не найден или нет прав" });

        // Отвязываем от документов вместо каскадного удаления
        var docs = await _context.Documents.Where(d => d.TemplateId == id).ToListAsync();
        foreach (var doc in docs) doc.TemplateId = null;

        _context.Templates.Remove(template);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}