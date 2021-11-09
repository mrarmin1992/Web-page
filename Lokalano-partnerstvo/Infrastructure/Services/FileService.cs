using System;
using System.IO;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Services
{
    public class FileService : IFileService
    {
        public void DeleteFromDisk(Fajl fajl)
        {
            if (File.Exists(Path.Combine("Content/fajlovi/", fajl.FileName)))
               {
                    File.Delete("Content/fajlovi/" + fajl.FileName);
               }
        }

        public async Task<Fajl> SaveToDiskAsync(IFormFile fajl)
        {
            var noviFajl = new Fajl();
               if (fajl.Length > 0)
               {
                    var fileName = Guid.NewGuid() + Path.GetExtension(fajl.FileName);
                    var filePath = Path.Combine("Content/fajlovi/", fileName);
                    await using var fileStream = new FileStream(filePath, FileMode.Create);
                    await fajl.CopyToAsync(fileStream);

                    noviFajl.OriginalFileName = fajl.FileName;
                    noviFajl.FileName = fileName;
                    noviFajl.FileUrl = "fajlovi/" + fileName;

                    return noviFajl;
               }

               return null;
        }
    }
}