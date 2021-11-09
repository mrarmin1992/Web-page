using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class KursCreateDto
    {
        
        [Required]
        public string Naziv { get; set; }
         [Required]
          public bool Aktivan { get; set; }
          [Required]
          public int BrojPolaznika { get; set; }
          [Required]
          public double Cijena { get; set; }
          public DateTime DatumObjave { get; set; }
          public DateTime DatumPocetka { get; set; }
          public int KursKategorijaId { get; set; }
          [Required]
          public string Opis { get; set; }
          public string KratakOpis { get; set; }
          [Required]
          public int Trajanje { get; set; }
          public string ImageUrl { get; set; }
    }
}



