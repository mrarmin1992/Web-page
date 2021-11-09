using System;

namespace API.Dtos
{
    public class ObukaToReturnDto
    {
        public int Id { get; set; }
          public string Naziv { get; set; }
          public bool Aktivan { get; set; }
          public int BrojPolaznika { get; set; }
          public double Cijena { get; set; }
          public DateTime DatumObjave { get; set; }
          public DateTime DatumPocetka { get; set; }
          public string ObukaKategorija { get; set; }
          public int ObukaKategorijaId { get; set; }
          public string Objavio { get; set; }
          public string Opis { get; set; }
          public string KratakOpis { get; set; }
          public int Trajanje { get; set; }
          public string  ImageUrl { get; set; }
          public PhotoToReturnDto Photo { get; set; }
    }
}