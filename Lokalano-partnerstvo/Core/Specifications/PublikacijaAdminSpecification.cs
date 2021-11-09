using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class PublikacijaAdminSpecification : BaseSpecification<Publikacija>
    {
        public PublikacijaAdminSpecification(PublikacijeSpecParams publikacijeParams) 
        : base(x => 
                (string.IsNullOrEmpty(publikacijeParams.Search) || x.Naziv.ToLower().Contains(publikacijeParams.Search)) ||
               (string.IsNullOrEmpty(publikacijeParams.Search) || x.Objavio.ToLower().Contains(publikacijeParams.Search)))
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

        public PublikacijaAdminSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.Photo);
            AddInclude(x => x.Fajl);
        }
    }
}