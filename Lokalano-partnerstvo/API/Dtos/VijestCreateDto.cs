using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class VijestCreateDto
    {
        [Required]
        public string Naslov { get; set; }
        [Required]
        public string Podnaslov { get; set; }
        public DateTime Datum { get; set; }
        public bool Fokus { get; set; }
        public int VijestKategorijaId { get; set; }
        [Required]
        public string Sadrzaj { get; set; }
        public string ImageUrl { get; set; }
    }
}