using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class DogadjajCreateDto
    {
        [Required]
        public string Naziv { get; set; }
        public int DogadjajKategorijaId { get; set; }
        [Required]
        public string Opis { get; set; }
        public DateTime DatumObjave { get; set; }
        public DateTime DatumPocetka { get; set; }
        [Required]
        public string VrijemePocetka { get; set; }
        public string  ImageUrl { get; set; }
    }
}