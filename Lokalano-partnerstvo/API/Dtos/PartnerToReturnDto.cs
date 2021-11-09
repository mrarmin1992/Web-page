using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class PartnerToReturnDto
    {
        public int Id { get; set; }
        public string Ime { get; set; }
        public string Opis { get; set; }
        public string Telefon { get; set; }
        public string Fax { get; set; }
        public string Mail { get; set; }
        public string Adresa { get; set; }
        public string Web { get; set; }
        public string Facebook { get; set; }
        public string Instagram { get; set; }
        public string Tiktok { get; set; }
        public string Youtube { get; set; }
        public string Twitter { get; set; }
        public string ImageUrl { get; set; }
        public PhotoToReturnDto Photo { get; set; }
    }
}