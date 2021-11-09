using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class PublikacijaCreateDto
    {
        [Required]
        public string Naziv { get; set; }
        [Required]
        public string Autor { get; set; }
        public DateTime DatumObjavljivanja { get; set; }
        [Required]
        public string Opis { get; set; }
        public string Path { get; set; }
    }
}