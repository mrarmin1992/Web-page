using System;
using Core.Entities;

namespace API.Dtos
{
    public class PrijaveToReturnDto
    {
        public int Id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public DateTime DatumRodjenja { get; set; }
        public DateTime DatumPrijave { get; set; }
        public string Email { get; set; }
        public string Telefon { get; set; }
        public string Zanimanje { get; set; }
        public bool Pogledano { get; set; }
        public int? KursId { get; set; }  
        // public string Kurs { get; set; }
        public int? ObukaId { get; set; }
        // public string Obuka { get; set; }
        public string PrethodnoZnanje { get; set; }
    }
}