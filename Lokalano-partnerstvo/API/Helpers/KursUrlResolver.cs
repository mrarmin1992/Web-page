using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class KursUrlResolver : IValueResolver<Kurs, KurseviToReturnDto, string>
     {
          private readonly IConfiguration _config;

           public KursUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Kurs source, KurseviToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.ImageUrl) && source.Photo != null )
               {
                    return _config["ApiUrl"] + source.ImageUrl;
               }
               return _config["ApiUrl"] + "images/kursevi/placeholder.png";
        }
    }
}