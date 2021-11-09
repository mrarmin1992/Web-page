using System;

namespace API.Dtos
{
    public class DogadjajiToReturnDto
    {
        public int Id { get; set; }
        public string Naziv { get; set; }
        public string DogadjajKategorija { get; set; }
        public int DogadjajKategorijaId { get; set; }
        public string Objavio { get; set; }
        public string Opis { get; set; }
        public DateTime DatumObjave { get; set; }
        public DateTime DatumPocetka { get; set; }
        public string VrijemePocetka { get; set; }
        public string  ImageUrl { get; set; }
    }
}