using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class VijestUrlResolver : IValueResolver<Vijest, VijestiToReturnDto, string>
    {
        private readonly IConfiguration _config;

        public VijestUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Vijest source, VijestiToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.ImageUrl) && source.Photo != null)
               {
                    return _config["ApiUrl"] + source.ImageUrl;
               }
               return _config["ApiUrl"] + "images/vijesti/placeholder.png";
        }
    }
}