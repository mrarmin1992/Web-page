using System;
using System.Linq.Expressions;
using Core.Entities.Identity;

namespace Core.Specifications
{
    public class UsersSpecification : BaseSpecification<AppUser>
    {
        public UsersSpecification(UsersSpecParams usersParams) : base(x =>
            (string.IsNullOrEmpty(usersParams.Search) || x.DisplayName.ToLower().Contains(usersParams.Search)) ||
            (string.IsNullOrEmpty(usersParams.Search) || x.Email.ToLower().Contains(usersParams.Search))
        )
        {
            AddOrderBy(x => x.Email);
            ApplyPaging(usersParams.PageSize * (usersParams.PageIndex - 1), usersParams.PageSize);

            if (!string.IsNullOrEmpty(usersParams.Sort))
            {
                switch (usersParams.Sort)
                {
                    case "emailAsc":
                        AddOrderBy(p => p.Email);
                        break;
                    case "emailDesc":
                        AddOrderByDescending(p => p.Email);
                        break;
                    case "nameAsc":
                        AddOrderBy(p => p.DisplayName);
                        break;
                    case "nameDesc":
                        AddOrderByDescending(p => p.DisplayName);
                        break;
                    default:
                        AddOrderBy(n => n.Email);
                        break;
                }
            }
        }

        public UsersSpecification(string email) : base(x => x.Email == email)
        {
        }
    }
}