using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ObukaSaKategorijomForCountSpecification : BaseSpecification<Obuka>
    {
        public ObukaSaKategorijomForCountSpecification(ObukaSpecParams obukaParams, string objava) 
        : base(x =>
                (string.IsNullOrEmpty(objava) || x.Objavio == objava) &&
                (string.IsNullOrEmpty(obukaParams.objava) || x.Objavio == obukaParams.objava) &&
               (string.IsNullOrEmpty(obukaParams.Search) || x.Naziv.ToLower().Contains(obukaParams.Search)) &&
               (!obukaParams.ObukaKategorijaId.HasValue || x.ObukaKategorijaId == obukaParams.ObukaKategorijaId)

          )
        {
        }
    }
}