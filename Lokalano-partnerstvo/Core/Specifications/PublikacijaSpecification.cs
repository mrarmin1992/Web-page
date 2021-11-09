using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class PublikacijaSpecification : BaseSpecification<Publikacija>
    {
        public PublikacijaSpecification(PublikacijeSpecParams publikacijeParams, string objava)
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
               (string.IsNullOrEmpty(publikacijeParams.Search) || x.Naziv.ToLower().Contains(publikacijeParams.Search))

          )
        {
            AddInclude(x => x.Photo);
            AddInclude(x => x.Fajl);
            AddOrderBy(x => x.Naziv);
            ApplyPaging(publikacijeParams.PageSize * (publikacijeParams.PageIndex - 1), publikacijeParams.PageSize);

            if (!string.IsNullOrEmpty(publikacijeParams.sort))
            {
                switch (publikacijeParams.sort)
                {
                    case "DateAsc":
                        AddOrderBy(p => p.DatumObjavljivanja);
                        break;
                    case "DateDesc":
                        AddOrderByDescending(p => p.DatumObjavljivanja);
                        break;
                    default:
                        AddOrderBy(n => n.Naziv);
                        break;
                }
            }
        }

        public PublikacijaSpecification(int id, string objava)
        : base(
             x => 
             (objava == "Admin" || x.Objavio == objava) &&
             (x.Id == id))
        {
            AddInclude(x => x.Photo);
            AddInclude(x => x.Fajl);
        }
        public PublikacijaSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.Photo);
            AddInclude(x => x.Fajl);
        }
    }
}