using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class PublikacijaAdminForCountSpecification : BaseSpecification<Publikacija>
    {
        public PublikacijaAdminForCountSpecification(PublikacijeSpecParams publikacijeParams) 
        : base(x => 
                (string.IsNullOrEmpty(publikacijeParams.Search) || x.Naziv.ToLower().Contains(publikacijeParams.Search)) ||
               (string.IsNullOrEmpty(publikacijeParams.Search) || x.Objavio.ToLower().Contains(publikacijeParams.Search)))
        {
        }
    }
}