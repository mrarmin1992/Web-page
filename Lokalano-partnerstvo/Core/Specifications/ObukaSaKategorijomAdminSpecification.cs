using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ObukaSaKategorijomAdminSpecification : BaseSpecification<Obuka>
    {

        public ObukaSaKategorijomAdminSpecification(ObukaSpecParams obukaParams) 
        : base(x =>
               ((string.IsNullOrEmpty(obukaParams.Search) || x.Naziv.ToLower().Contains(obukaParams.Search)) ||
               (string.IsNullOrEmpty(obukaParams.Search) || x.Objavio.ToLower().Contains(obukaParams.Search))) &&
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
        public ObukaSaKategorijomAdminSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.ObukaKategorija);
            AddInclude(x => x.Photo);
        }
    }
}