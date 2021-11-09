using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class PrijavaCreateDto
    {
        [Required]
        public string Ime { get; set; }
        [Required]
        public string Prezime { get; set; }
        [Required]
        public DateTime DatumRodjenja { get; set; }
        public DateTime DatumPrijave { get; set; }
        [Required]
        public string Email { get; set; }
        // public string JMBG { get; set; }
        [Required]
        public string Telefon { get; set; }
        // public string Adresa { get; set; }
        [Required]
        public string Zanimanje { get; set; }
        public bool Pogledano { get; set; }
        public int? KursId { get; set; }  
        public int? ObukaId { get; set; }
        public string PrethodnoZnanje { get; set; }
        public string Objava { get; set; }
    }
}