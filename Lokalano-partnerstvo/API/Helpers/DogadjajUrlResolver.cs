using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class DogadjajUrlResolver : IValueResolver<Dogadjaj, DogadjajiToReturnDto, string>
    {
        private readonly IConfiguration _config;
        public DogadjajUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Dogadjaj source, DogadjajiToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.ImageUrl) && source.Photo != null )
               {
                    return _config["ApiUrl"] + source.ImageUrl;
               }
               return _config["ApiUrl"] + "images/dogadjaji/placeholder.png";
        }
    }
}