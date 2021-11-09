using System;

namespace Core.Entities
{
    public class Obuka : BaseEntity
    {
        public string Naziv { get; set; }
        public bool Aktivan { get; set; }
        public int BrojPolaznika { get; set; }
        public double Cijena { get; set; }
        public DateTime DatumObjave { get; set; }
        public DateTime DatumPocetka { get; set; }
        public int ObukaKategorijaId { get; set; }
        public ObukaKategorija ObukaKategorija { get; set; }
        public string Objavio { get; set; }
        public string Opis { get; set; }
        public string KratakOpis { get; set; }
        public int Trajanje { get; set; }
        public Photo Photo { get; set; }
        public int? PhotoId { get; set; }
        public string  ImageUrl { get; set; }

        public void AddPhoto(string imageUrl, string fileName)
        {
            var photo = new Photo
            {
                FileName = fileName,
                PictureUrl = imageUrl
            };

            Photo = photo;
        }
        public void RemovePhoto()
        {
            if (Photo != null)
            {
                Photo = null;
            }
        }
    }
}