using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class PartnerForCountSpecification : BaseSpecification<Partner>
    {
        public PartnerForCountSpecification(PartnerSpecParams partnerParams)
        : base(x =>
               (string.IsNullOrEmpty(partnerParams.Search) || x.Ime.ToLower().Contains(partnerParams.Search))
          )
          {}
    }
}