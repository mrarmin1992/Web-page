using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Core.Entities;

namespace Core.Specifications
{
    public class PartnerSpecification : BaseSpecification<Partner>
    {
        public PartnerSpecification(PartnerSpecParams partnerParams)
        : base(x =>
               (string.IsNullOrEmpty(partnerParams.Search) || x.Ime.ToLower().Contains(partnerParams.Search))
          )
        {
            AddInclude(x => x.Photo);
            ApplyPaging(partnerParams.PageSize * (partnerParams.PageIndex - 1), partnerParams.PageSize);

            if (!string.IsNullOrEmpty(partnerParams.sort))
            {
                switch (partnerParams.sort)
                {
                    case "ime":
                        AddOrderBy(p => p.Ime);
                        break;
                    case "imeDesc":
                        AddOrderByDescending(p => p.Ime);
                        break;
                    default:
                        AddOrderBy(p => p.Ime);
                        break;
                }
            }
        }

        public PartnerSpecification(int id)
        : base(x => x.Id == id)
        {
            AddInclude(x => x.Photo);
        }

        public PartnerSpecification(string email)
        : base(x => x.Mail == email)
        {
            AddInclude(x => x.Photo);
        }
    }
}