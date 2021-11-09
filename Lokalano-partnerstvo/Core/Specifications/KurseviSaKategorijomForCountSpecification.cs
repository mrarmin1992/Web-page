using Core.Entities;

namespace Core.Specifications
{
     public class KurseviSaKategorijomForCountSpecification : BaseSpecification<Kurs>
     {
          public KurseviSaKategorijomForCountSpecification(KursSpecParams kursParams, string objava)
          : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
               (string.IsNullOrEmpty(kursParams.objava) || x.Objavio == kursParams.objava) &&
               (string.IsNullOrEmpty(kursParams.Search) || x.Naziv.ToLower().Contains(kursParams.Search)) &&
               (!kursParams.KursKategorijaId.HasValue || x.KursKategorijaId == kursParams.KursKategorijaId)
          )
          {
          }
     }
}