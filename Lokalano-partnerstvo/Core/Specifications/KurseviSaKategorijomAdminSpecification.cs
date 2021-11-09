using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class KurseviSaKategorijomAdminSpecification : BaseSpecification<Kurs>
    {
        public KurseviSaKategorijomAdminSpecification(KursSpecParams kursParams)
          : base(x =>
               ((string.IsNullOrEmpty(kursParams.Search) || x.Naziv.ToLower().Contains(kursParams.Search)) ||
               (string.IsNullOrEmpty(kursParams.Search) || x.Objavio.ToLower().Contains(kursParams.Search))) &&
               (!kursParams.KursKategorijaId.HasValue || x.KursKategorijaId == kursParams.KursKategorijaId)

          )
          {
               AddInclude(x => x.KursKategorija);
               AddInclude(x => x.Photo);
               AddOrderBy(x => x.Naziv);
               ApplyPaging(kursParams.PageSize * (kursParams.PageIndex - 1), kursParams.PageSize);

               if (!string.IsNullOrEmpty(kursParams.sort))
               {
                    switch (kursParams.sort)
                    {
                         case "naziv":
                        AddOrderBy(p => p.Naziv);
                        break;
                    case "datumObjave":
                        AddOrderBy(p => p.DatumObjave);
                        break;
                    case "datumObjaveDesc":
                        AddOrderByDescending(p => p.DatumObjave);
                        break;
                    case "datumPocetka":
                        AddOrderBy(p => p.DatumPocetka);
                        break;
                    case "datumPocetkaDesc":
                        AddOrderByDescending(p => p.DatumPocetka);
                        break;
                    default:
                        AddOrderByDescending(n => n.DatumPocetka);
                        break;
                    }
               }
          }

        public KurseviSaKategorijomAdminSpecification(int id)
            : base(
             x => x.Id == id)
          {
               AddInclude(x => x.KursKategorija);
               AddInclude(x => x.Photo);
          }
    }
}