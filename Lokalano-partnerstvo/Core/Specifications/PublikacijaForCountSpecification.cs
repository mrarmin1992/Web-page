using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class PublikacijaForCountSpecification : BaseSpecification<Publikacija>
    {
        public PublikacijaForCountSpecification(PublikacijeSpecParams publikacijeParams, string objava) 
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
               (string.IsNullOrEmpty(publikacijeParams.Search) || x.Naziv.ToLower().Contains(publikacijeParams.Search))
          )
        {
        }
    }
}