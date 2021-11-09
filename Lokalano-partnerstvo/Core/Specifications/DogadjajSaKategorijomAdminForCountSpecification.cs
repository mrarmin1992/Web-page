using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class DogadjajSaKategorijomAdminForCountSpecification : BaseSpecification<Dogadjaj>
    {
        public DogadjajSaKategorijomAdminForCountSpecification(DogadjajSpecParams dogadjajParams)
          : base(x =>
               ((string.IsNullOrEmpty(dogadjajParams.Search) || x.Naziv.ToLower().Contains(dogadjajParams.Search)) ||
               (string.IsNullOrEmpty(dogadjajParams.Search) || x.Objavio.ToLower().Contains(dogadjajParams.Search))) &&
               (!dogadjajParams.DogadjajKategorijaId.HasValue || x.DogadjajKategorijaId == dogadjajParams.DogadjajKategorijaId)

          )
        {
        }
    }
}