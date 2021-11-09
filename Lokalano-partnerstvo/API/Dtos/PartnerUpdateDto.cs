using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class PartnerUpdateDto
    {
        public string Opis { get; set; }
        [Required]
        public string Telefon { get; set; }
        public string Fax { get; set; }
        [Required]
        public string Adresa { get; set; }
        public string Web { get; set; }
        public string Facebook { get; set; }
        public string Instagram { get; set; }
        public string Tiktok { get; set; }
        public string Youtube { get; set; }
        public string Twitter { get; set; }
    }
}