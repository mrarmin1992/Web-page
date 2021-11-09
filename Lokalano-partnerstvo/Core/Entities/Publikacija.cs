using System;

namespace Core.Entities
{
    public class Publikacija : BaseEntity
    {
        public string Naziv { get; set; }
        public string Autor { get; set; }
        public DateTime DatumObjavljivanja { get; set; }
        public string Opis { get; set; }
        public string Objavio { get; set; }
        public Fajl Fajl { get; set; }
        public int? FajlId { get; set; }
        public Photo Photo { get; set; }
        public int? PhotoId { get; set; }
        public string Path { get; set; }
        public string PhotoPath { get; set; }

        public void AddFile(string fajlUrl, string fileName, string originalFileName)
        {
            var fajl = new Fajl
            {
                FileName = fileName,
                FileUrl = fajlUrl,
                OriginalFileName = originalFileName
            };

            Fajl = fajl;
        }
        public void RemoveFajl()
        {
            if (Fajl != null)
            {
                Fajl = null;
            }
        }
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