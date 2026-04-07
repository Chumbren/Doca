using Doca.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using Document = Doca.Server.Models.Document;
namespace Doca.Server.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<Document> Documents => Set<Document>();
        public DbSet<DocumentVersion> DocumentVersions => Set<DocumentVersion>();
        public DbSet<Template> Templates => Set<Template>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Template>()
                    .HasOne(t => t.CreatedBy)
                    .WithMany(u => u.CreatedTemplates) 
                    .HasForeignKey(t => t.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Document>()
                    .HasOne(d => d.Template)
                    .WithMany(t => t.Documents)
                    .HasForeignKey(d => d.TemplateId)
                    .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
