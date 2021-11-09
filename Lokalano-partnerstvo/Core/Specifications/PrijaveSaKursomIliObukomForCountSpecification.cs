using Core.Entities;

namespace Core.Specifications
{
    public class PrijaveSaKursomIliObukomForCountSpecification : BaseSpecification<Prijava>
    {
        public PrijaveSaKursomIliObukomForCountSpecification(PrijavaSpecParams prijaveParams, string objava)
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objava == objava) &&
               ((string.IsNullOrEmpty(prijaveParams.Search) || x.Ime.ToLower().Contains(prijaveParams.Search)) ||
               (string.IsNullOrEmpty(prijaveParams.Search) || x.Prezime.ToLower().Contains(prijaveParams.Search)) ||
               (string.IsNullOrEmpty(prijaveParams.Search) || x.Email.ToLower().Contains(prijaveParams.Search))) &&
               (!prijaveParams.KursId.HasValue || x.KursId == prijaveParams.KursId) && 
               (!prijaveParams.ObukaId.HasValue || x.ObukaId == prijaveParams.ObukaId) &&
               (!prijaveParams.pogledano.HasValue || x.Pogledano == prijaveParams.pogledano)
          ){}
    }
}