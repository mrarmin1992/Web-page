using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class DogadjajSaKategorijomSpecification : BaseSpecification<Dogadjaj>
    {

        public DogadjajSaKategorijomSpecification(DogadjajSpecParams dogadjajParams, string objava)
        : base(x =>
                (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
                (string.IsNullOrEmpty(dogadjajParams.objava) || x.Objavio == dogadjajParams.objava) &&
                (string.IsNullOrEmpty(dogadjajParams.Search) || x.Naziv.ToLower().Contains(dogadjajParams.Search)) &&
                (!dogadjajParams.DogadjajKategorijaId.HasValue || x.DogadjajKategorijaId == dogadjajParams.DogadjajKategorijaId)

          )
        {
            AddInclude(x => x.DogadjajKategorija);
            AddInclude(x => x.Photo);
            AddOrderBy(x => x.Naziv);
            ApplyPaging(dogadjajParams.PageSize * (dogadjajParams.PageIndex - 1), dogadjajParams.PageSize);

            if (!string.IsNullOrEmpty(dogadjajParams.sort))
            {
                switch (dogadjajParams.sort)
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

        public DogadjajSaKategorijomSpecification(int id, string objava)
        : base(
           x =>
           (objava == "Admin" || x.Objavio == objava) &&
           (x.Id == id))
        {
            AddInclude(x => x.DogadjajKategorija);
            AddInclude(x => x.Photo);
        }

        public DogadjajSaKategorijomSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.DogadjajKategorija);
            AddInclude(x => x.Photo);
        }
    }
}