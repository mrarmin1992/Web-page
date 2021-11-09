using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class ObukaUrlResolver : IValueResolver<Obuka, ObukaToReturnDto, string>
     {
          private readonly IConfiguration _config;

           public ObukaUrlResolver(IConfiguration config)
        {
            _config = config;
        }

    public string Resolve(Obuka source, ObukaToReturnDto destination, string destMember, ResolutionContext context)
    {
       if (!string.IsNullOrEmpty(source.ImageUrl))
               {
                    return _config["ApiUrl"] + source.ImageUrl;
               }
               return _config["ApiUrl"] + "images/obuke/placeholder.jpg";
    }
  }
}