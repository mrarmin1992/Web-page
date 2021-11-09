using Core.Entities.Identity;

namespace Core.Specifications
{
    public class UsersForCountSpecification : BaseSpecification<AppUser>
    {
        public UsersForCountSpecification(UsersSpecParams usersParams) : base(x =>
            (string.IsNullOrEmpty(usersParams.Search) || x.DisplayName.ToLower().Contains(usersParams.Search)) ||
            (string.IsNullOrEmpty(usersParams.Search) || x.Email.ToLower().Contains(usersParams.Search))
        )
        {}
    }
}