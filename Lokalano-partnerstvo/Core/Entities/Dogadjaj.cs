using System;

namespace Core.Entities
{
    public class Dogadjaj : BaseEntity
    {
        public string Naziv { get; set; }
        public int DogadjajKategorijaId { get; set; }
        public DogadjajKategorija DogadjajKategorija { get; set; }
        public string Objavio { get; set; }
        public string Opis { get; set; }
        public DateTime DatumObjave { get; set; }
        public DateTime DatumPocetka { get; set; }
        public string VrijemePocetka { get; set; }
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