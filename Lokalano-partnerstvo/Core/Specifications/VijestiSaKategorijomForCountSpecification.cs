using Core.Entities;

namespace Core.Specifications
{
    public class VijestiSaKategorijomForCountSpecification : BaseSpecification<Vijest>
    {
        public VijestiSaKategorijomForCountSpecification(VijestSpecParams vijestiParams, string objava)
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
               (string.IsNullOrEmpty(vijestiParams.objava) || x.Objavio == vijestiParams.objava) &&
               (string.IsNullOrEmpty(vijestiParams.Search) || x.Naslov.ToLower().Contains(vijestiParams.Search)) &&
               (!vijestiParams.VijestKategorijaId.HasValue || x.VijestKategorijaId == vijestiParams.VijestKategorijaId)

          )
        {
        }
    }
}