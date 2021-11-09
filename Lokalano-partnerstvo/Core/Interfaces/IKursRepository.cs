using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IKursRepository
    {
        Task<Kurs> GetKursByIdAsync(int id);
        Task<IReadOnlyList<Kurs>> GetKurseveAsync();
        Task<IReadOnlyList<KursKategorija>> GetKursKategorije();
    }
}