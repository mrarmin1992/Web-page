using System;

namespace API.Dtos
{
    public class VijestiToReturnDto
    {
        public int Id { get; set; }
        public string Naslov { get; set; }
        public string Podnaslov { get; set; }
        public DateTime Datum { get; set; }
        public bool Fokus { get; set; }
        public string Objavio { get; set; }
        public string VijestKategorija { get; set; }
        public int VijestKategorijaId { get; set; }
        public string Sadrzaj { get; set; }
        public string  ImageUrl { get; set; }
        public PhotoToReturnDto Photo { get; set; }
    }
}