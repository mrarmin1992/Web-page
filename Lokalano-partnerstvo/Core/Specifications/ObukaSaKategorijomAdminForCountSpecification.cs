using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ObukaSaKategorijomAdminForCountSpecification : BaseSpecification<Obuka>
    {
        public ObukaSaKategorijomAdminForCountSpecification(ObukaSpecParams obukaParams) 
        : base(x =>
               ((string.IsNullOrEmpty(obukaParams.Search) || x.Naziv.ToLower().Contains(obukaParams.Search)) ||
               (string.IsNullOrEmpty(obukaParams.Search) || x.Objavio.ToLower().Contains(obukaParams.Search))) &&
               (!obukaParams.ObukaKategorijaId.HasValue || x.ObukaKategorijaId == obukaParams.ObukaKategorijaId)
                )
        {
        }
    }
}