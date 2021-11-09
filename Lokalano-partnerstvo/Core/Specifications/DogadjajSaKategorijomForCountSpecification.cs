using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class DogadjajSaKategorijomForCountSpecification : BaseSpecification<Dogadjaj>
    {
        public DogadjajSaKategorijomForCountSpecification(DogadjajSpecParams dogadjajParams, string objava)
        : base(x =>
               (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
               (string.IsNullOrEmpty(dogadjajParams.objava) || x.Objavio == dogadjajParams.objava) &&
               (string.IsNullOrEmpty(dogadjajParams.Search) || x.Naziv.ToLower().Contains(dogadjajParams.Search)) &&
               (!dogadjajParams.DogadjajKategorijaId.HasValue || x.DogadjajKategorijaId == dogadjajParams.DogadjajKategorijaId)

          )
        {
        }
    }
}