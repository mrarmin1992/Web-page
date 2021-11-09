using Core.Entities;

namespace Core.Specifications
{
    public class VijestiSaKategorijomAdminForCountSpecification : BaseSpecification<Vijest>
    {
        public VijestiSaKategorijomAdminForCountSpecification(VijestSpecParams vijestiParams)
        : base(x =>
               ((string.IsNullOrEmpty(vijestiParams.Search) || x.Naslov.ToLower().Contains(vijestiParams.Search)) ||
               (string.IsNullOrEmpty(vijestiParams.Search) || x.Objavio.ToLower().Contains(vijestiParams.Search))) &&
               (!vijestiParams.VijestKategorijaId.HasValue || x.VijestKategorijaId == vijestiParams.VijestKategorijaId)

          )
        {
        }
    }
}