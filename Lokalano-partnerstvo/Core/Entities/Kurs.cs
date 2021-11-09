using System;

namespace Core.Entities
{
    public class Kurs : BaseEntity
    {
        public string Naziv { get; set; }
        public bool Aktivan { get; set; }
        public int BrojPolaznika { get; set; }
        public double Cijena { get; set; }
        public DateTime DatumObjave { get; set; } = DateTime.Now;
        public DateTime DatumPocetka { get; set; } = DateTime.Now;
        public int KursKategorijaId { get; set; }
        public KursKategorija KursKategorija { get; set; }
        public string Objavio { get; set; }
        public string Opis { get; set; }
        public string KratakOpis { get; set; }
        public int Trajanje { get; set; }
        public string  ImageUrl { get; set; }
        public Photo Photo { get; set; }
        public int? PhotoId { get; set; }

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