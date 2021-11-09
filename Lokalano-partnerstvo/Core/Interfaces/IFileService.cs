using System.Threading.Tasks;
using Core.Entities;
using Microsoft.AspNetCore.Http;

namespace Core.Interfaces
{
    public interface IFileService
    {
        Task<Fajl> SaveToDiskAsync(IFormFile fajl);
        void DeleteFromDisk(Fajl fajl);
    }
}