using Core.Entities;

namespace Core.Specifications
{
    public class PrijaveForCountSpecification : BaseSpecification<Prijava>
    {
        public PrijaveForCountSpecification(PrijavaSpecParams prijaveParams, string objava)
        : base(x =>
               (!prijaveParams.pogledano.HasValue || x.Pogledano == prijaveParams.pogledano) &&
               (string.IsNullOrEmpty(objava) || x.Objava == objava) &&
               ((string.IsNullOrEmpty(prijaveParams.Search) || x.Ime.ToLower().Contains(prijaveParams.Search)) ||
               (string.IsNullOrEmpty(prijaveParams.Search) || x.Prezime.ToLower().Contains(prijaveParams.Search)) ||
               (string.IsNullOrEmpty(prijaveParams.Search) || x.Email.ToLower().Contains(prijaveParams.Search))) 

          )
        {
        }
    }
}