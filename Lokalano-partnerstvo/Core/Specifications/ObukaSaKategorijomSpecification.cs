using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ObukaSaKategorijomSpecification : BaseSpecification<Obuka>
    {

        public ObukaSaKategorijomSpecification(ObukaSpecParams obukaParams, string objava)
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
               (string.IsNullOrEmpty(obukaParams.objava) || x.Objavio == obukaParams.objava) &&
               (string.IsNullOrEmpty(obukaParams.Search) || x.Naziv.ToLower().Contains(obukaParams.Search)) &&
               (!obukaParams.ObukaKategorijaId.HasValue || x.ObukaKategorijaId == obukaParams.ObukaKategorijaId)

          )
        {
            AddInclude(x => x.ObukaKategorija);
            AddInclude(x => x.Photo);
            AddOrderBy(x => x.Naziv);
            ApplyPaging(obukaParams.PageSize * (obukaParams.PageIndex - 1), obukaParams.PageSize);

            if (!string.IsNullOrEmpty(obukaParams.sort))
            {
                switch (obukaParams.sort)
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

        public ObukaSaKategorijomSpecification(int id, string objava)
        : base(x =>
             (objava == "Admin" || x.Objavio == objava) &&
             (x.Id == id))
        {
            AddInclude(x => x.ObukaKategorija);
            AddInclude(x => x.Photo);
        }

        public ObukaSaKategorijomSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.ObukaKategorija);
            AddInclude(x => x.Photo);
        }
    }
}