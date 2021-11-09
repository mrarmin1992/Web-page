using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class KurseviSaKategorijomAdminForCountSpecification : BaseSpecification<Kurs>
    {
        public KurseviSaKategorijomAdminForCountSpecification(KursSpecParams kursParams)
          : base(x =>
               ((string.IsNullOrEmpty(kursParams.Search) || x.Naziv.ToLower().Contains(kursParams.Search)) ||
               (string.IsNullOrEmpty(kursParams.Search) || x.Objavio.ToLower().Contains(kursParams.Search))) &&
               (!kursParams.KursKategorijaId.HasValue || x.KursKategorijaId == kursParams.KursKategorijaId)

          )
        {
        }
    }
}