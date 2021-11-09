using System;

namespace API.Dtos
{
    public class PublikacijeToReturnDto
    {
        public int Id { get; set; }
        public string Naziv { get; set; }
        public string Autor { get; set; }
        public DateTime DatumObjavljivanja { get; set; }
        public string Opis { get; set; }
        public string Objavio { get; set; }
        public string Path { get; set; }
        public string FileName { get; set; }
        public string PhotoPath { get; set; }
    }
}