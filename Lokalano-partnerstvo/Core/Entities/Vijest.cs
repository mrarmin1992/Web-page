using System;

namespace Core.Entities
{
    public class Vijest : BaseEntity
    {
        public string Naslov { get; set; }
        public string Podnaslov { get; set; }
        public DateTime Datum { get; set; }
        public bool Fokus { get; set; }
        public string Objavio { get; set; }
        public int VijestKategorijaId { get; set; }
        public VijestKategorija VijestKategorija { get; set; }
        public string Sadrzaj { get; set; }
        public Photo Photo { get; set; }
        public int? PhotoId { get; set; }
        public string ImageUrl { get; set; }

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