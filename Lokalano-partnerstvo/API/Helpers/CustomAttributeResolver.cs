using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
     public class CustomAttributeResolver : IValueResolver<Vijest, VijestiToReturnDto, string>
     {
          private readonly IConfiguration _config;
          public CustomAttributeResolver(IConfiguration config)
          {
               _config = config;
          }


        public string Resolve(Vijest source, VijestiToReturnDto destination, string destMember, ResolutionContext context)
        {
             if (!string.IsNullOrEmpty(source.ImageUrl))
               {
                    return _config["ApiUrl"] + source.ImageUrl;
               }
               return null;
        }
    }
}