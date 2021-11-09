using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class PrijaveSpecification : BaseSpecification<Prijava>
    {
        public PrijaveSpecification(PrijavaSpecParams prijaveParams, string objava)
        : base(x =>
               (!prijaveParams.pogledano.HasValue || x.Pogledano == prijaveParams.pogledano) &&
               (string.IsNullOrEmpty(objava) || x.Objava == objava) &&
               ((string.IsNullOrEmpty(prijaveParams.Search) || x.Ime.ToLower().Contains(prijaveParams.Search)) ||
               (string.IsNullOrEmpty(prijaveParams.Search) || x.Prezime.ToLower().Contains(prijaveParams.Search)) ||
               (string.IsNullOrEmpty(prijaveParams.Search) || x.Email.ToLower().Contains(prijaveParams.Search))) 

          )
        {
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

        public PrijaveSpecification(int id) 
        : base(x => x.Id == id)
        {
        }
        public PrijaveSpecification(int id, string objava) 
        : base(
             x => 
             (objava == "Admin" || x.Objava == objava) &&
             (x.Id == id))
        {
        }
    }
}