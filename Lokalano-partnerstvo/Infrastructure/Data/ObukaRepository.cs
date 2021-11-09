using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ObukaRepository : IObukaRepository
    {
        private readonly MyContext _context;
        public ObukaRepository(MyContext context)
        {
            _context = context;
        }

        public async Task<Obuka> GetObukaByIdAsync(int id)
        {
            return await _context.Obuke.Include(p => p.ObukaKategorija).FirstOrDefaultAsync(p => p.Id == id); 
        }

        public async Task<IReadOnlyList<Obuka>> GetObukeAsync()
        {
            return await _context.Obuke.Include(p => p.ObukaKategorija).ToListAsync();
        }

        public async Task<IReadOnlyList<ObukaKategorija>> GetObukaKategorije()
        {
            return await _context.ObukaKategorije.ToListAsync();
        }
    }
}