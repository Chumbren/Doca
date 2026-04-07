using Ganss.Xss;

namespace Doca.Server.Services
{

    public class SanitizerService : ISanitizerService
    {
        private readonly HtmlSanitizer _sanitizer;

        public SanitizerService()
        {
            _sanitizer = new HtmlSanitizer();

            _sanitizer.AllowedTags.UnionWith(
            [
    "p", "br", "strong", "em", "u", "ul", "ol", "li",
    "h1", "h2", "h3", "blockquote", "code", "pre",
    "span", "img", "a", "table", "thead", "tbody", "tr", "td", "th", "hr"
]);

            _sanitizer.AllowedTags.UnionWith(["mark", "u", "s", "figure", "figcaption"]);
            _sanitizer.AllowedAttributes.UnionWith(["data-template-field", "data-field", "width", "style", "data-*", "class"]);
            _sanitizer.AllowedClasses.UnionWith([
    "align-left", "align-center", "align-right",
    "highlight", "ProseMirror", "is-editor-empty",
     "text-align-left", "text-align-center", "text-align-right", "text-align-justify"
]);
            _sanitizer.AllowedSchemes.UnionWith(["data"]);
            _sanitizer.AllowedSchemes.Clear();
            _sanitizer.AllowedSchemes.UnionWith(["http", "https", "mailto", "tel", "data"]);
        }

        public string Sanitize(string html) =>
            string.IsNullOrWhiteSpace(html) ? html : _sanitizer.Sanitize(html);
    }
}
