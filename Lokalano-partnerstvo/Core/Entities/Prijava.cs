using System;

namespace Core.Entities
{
    public class Prijava : BaseEntity
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public DateTime DatumRodjenja { get; set; }
        public DateTime DatumPrijave { get; set; }
        public string Email { get; set; }
        // public string JMBG { get; set; }
        public string Telefon { get; set; }
        // public string Adresa { get; set; }
        public string Zanimanje { get; set; }
        public bool Pogledano { get; set; }
        public int? KursId { get; set; }  
        public Kurs Kurs { get; set; }
        public int? ObukaId { get; set; }
        public Obuka Obuka { get; set; }
        public string PrethodnoZnanje { get; set; }
        public string Objava { get; set; }
    }
}