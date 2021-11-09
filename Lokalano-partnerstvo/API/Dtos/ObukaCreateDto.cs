using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class ObukaCreateDto
    {
        [Required]
          public string Naziv { get; set; }
          public bool Aktivan { get; set; }
          [Required]
          public int BrojPolaznika { get; set; }
          [Required]
          public double Cijena { get; set; }
          public DateTime DatumObjave { get; set; }
          public DateTime DatumPocetka { get; set; }
          public int ObukaKategorijaId { get; set; }
          [Required]
          public string Opis { get; set; }
          public string KratakOpis { get; set; }
          [Required]
          public int Trajanje { get; set; }
         public string ImageUrl { get; set; }
    }
}
