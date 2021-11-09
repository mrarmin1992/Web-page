using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Dtos
{
    public class PhotoDto
    {
        [AllowedExtensions(new[] { ".jpg", ".png", ".jpeg" })]
        public IFormFile Photo { get; set; }
    }
}