using Core.Entities;

namespace Core.Specifications
{
    public class PrijaveSaKursomIliObukomSpecification : BaseSpecification<Prijava>
    {
        public PrijaveSaKursomIliObukomSpecification(PrijavaSpecParams prijaveParams, string objava)
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objava == objava) &&
               ((string.IsNullOrEmpty(prijaveParams.Search) || x.Ime.ToLower().Contains(prijaveParams.Search)) ||
               (string.IsNullOrEmpty(prijaveParams.Search) || x.Prezime.ToLower().Contains(prijaveParams.Search)) ||
               (string.IsNullOrEmpty(prijaveParams.Search) || x.Email.ToLower().Contains(prijaveParams.Search))) &&
               (!prijaveParams.KursId.HasValue || x.KursId == prijaveParams.KursId) && 
               (!prijaveParams.ObukaId.HasValue || x.ObukaId == prijaveParams.ObukaId) &&
               (!prijaveParams.pogledano.HasValue || x.Pogledano == prijaveParams.pogledano)


          )
        {
            if (prijaveParams.KursId != null){
                AddInclude(x => x.Kurs);
            }
            if (prijaveParams.ObukaId != null){
                AddInclude(x => x.Obuka);
            }
            AddOrderBy(x => x.Ime);
            ApplyPaging(prijaveParams.PageSize * (prijaveParams.PageIndex - 1), prijaveParams.PageSize);

            if (!string.IsNullOrEmpty(prijaveParams.sort))
            {
                switch (prijaveParams.sort)
                {
                    case "DateAsc":
                        AddOrderBy(p => p.DatumPrijave);
                        break;
                    case "DateDesc":
                        AddOrderByDescending(p => p.DatumPrijave);
                        break;
                    default:
                        AddOrderBy(n => n.Ime);
                        break;
                }
            }
        }

        public PrijaveSaKursomIliObukomSpecification(int id) 
        : base(x => x.Id == id)
        {
        }
        public PrijaveSaKursomIliObukomSpecification(int id, string objava) 
        : base(
             x => 
             (objava == "Admin" || x.Objava == objava) &&
             (x.Id == id))
        {
        }
    }
}