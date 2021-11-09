using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IObukaRepository
    {
         Task<Obuka> GetObukaByIdAsync(int id);
        Task<IReadOnlyList<Obuka>> GetObukeAsync();
        Task<IReadOnlyList<ObukaKategorija>> GetObukaKategorije();
    }
}
