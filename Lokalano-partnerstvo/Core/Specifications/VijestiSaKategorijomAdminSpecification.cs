using Core.Entities;

namespace Core.Specifications
{
    public class VijestiSaKategorijomAdminSpecification : BaseSpecification<Vijest>
    {
        public VijestiSaKategorijomAdminSpecification(VijestSpecParams vijestiParams)
        : base(x =>
               ((string.IsNullOrEmpty(vijestiParams.Search) || x.Naslov.ToLower().Contains(vijestiParams.Search)) ||
               (string.IsNullOrEmpty(vijestiParams.Search) || x.Objavio.ToLower().Contains(vijestiParams.Search))) &&
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
                        AddOrderBy(n => n.Datum);
                        break;
                }
            }
        }
        public VijestiSaKategorijomAdminSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.VijestKategorija);
            AddInclude(x => x.Photo);
        }
    }
}