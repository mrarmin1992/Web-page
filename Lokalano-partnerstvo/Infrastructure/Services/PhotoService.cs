using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;

namespace Infrastructure.Services
{
    public class PhotoService : IPhotoService
    {
        public void DeleteFromDisk(Photo photo, string tip)
        {
            if (File.Exists(Path.Combine("Content/images/" + tip, photo.FileName)))
               {
                    File.Delete("Content/images/" + tip + "/" + photo.FileName);
               }
        }

        public async Task<Photo> SaveToDiskAsync(IFormFile file, string tip)
        {
            var photo = new Photo();
               if (file.Length > 0)
               {
                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine("Content/images/" + tip, fileName);
                    await using var fileStream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(fileStream);

                    photo.FileName = fileName;
                    photo.PictureUrl = "images/" + tip + "/" + fileName;

                    return photo;
               }

               return null;
        }
    }
}