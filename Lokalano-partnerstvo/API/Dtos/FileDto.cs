using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Dtos
{
    public class FileDto
    {
        [AllowedExtensions(new[] {".pdf", ".doc", ".docx", ".pptx", ".xlsx"})]
        public IFormFile fajl { get; set; }
    }
}