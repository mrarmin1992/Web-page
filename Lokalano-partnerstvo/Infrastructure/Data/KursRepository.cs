using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class KursRepository : IKursRepository
    {
        private readonly MyContext _context;
        public KursRepository(MyContext context)
        {
            _context = context;
        }

        public async Task<Kurs> GetKursByIdAsync(int id)
        {
            return await _context.Kursevi.Include(p => p.KursKategorija).FirstOrDefaultAsync(p => p.Id == id); 
        }

        public async Task<IReadOnlyList<Kurs>> GetKurseveAsync()
        {
            return await _context.Kursevi.Include(p => p.KursKategorija).ToListAsync();
        }

        public async Task<IReadOnlyList<KursKategorija>> GetKursKategorije()
        {
            return await _context.KursKategorije.ToListAsync();
        }
    }
}