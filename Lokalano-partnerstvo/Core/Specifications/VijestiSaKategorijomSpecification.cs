using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class VijestiSaKategorijomSpecification : BaseSpecification<Vijest>
    {

        public VijestiSaKategorijomSpecification(VijestSpecParams vijestiParams, string objava)
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
               (string.IsNullOrEmpty(vijestiParams.objava) || x.Objavio == vijestiParams.objava) &&
               (string.IsNullOrEmpty(vijestiParams.Search) || x.Naslov.ToLower().Contains(vijestiParams.Search)) &&
               (!vijestiParams.VijestKategorijaId.HasValue || x.VijestKategorijaId == vijestiParams.VijestKategorijaId)

          )
        {
            AddInclude(x => x.VijestKategorija);
            AddInclude(x => x.Photo);
            AddOrderBy(x => x.Datum);
            ApplyPaging(vijestiParams.PageSize * (vijestiParams.PageIndex - 1), vijestiParams.PageSize);

            if (!string.IsNullOrEmpty(vijestiParams.sort))
            {
                switch (vijestiParams.sort)
                {
                    case "Naslov":
                        AddOrderBy(p => p.Naslov);
                        break;
                    case "DateAsc":
                        AddOrderBy(p => p.Datum);
                        break;
                    case "DateDesc":
                        AddOrderByDescending(p => p.Datum);
                        break;
                    default:
                        AddOrderByDescending(n => n.Datum);
                        break;
                }
            }
        }
        public VijestiSaKategorijomSpecification(int id, string objava)
        : base(
             x =>
             (objava == "Admin" || x.Objavio == objava) &&
             (x.Id == id))
        {
            AddInclude(x => x.VijestKategorija);
            AddInclude(x => x.Photo);
        }

        public VijestiSaKategorijomSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.VijestKategorija);
            AddInclude(x => x.Photo);
        }
    }
}