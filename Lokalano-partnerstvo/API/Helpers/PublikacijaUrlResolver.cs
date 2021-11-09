using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class PublikacijaUrlResolver : IValueResolver<Publikacija, PublikacijeToReturnDto, string>
    {
        private readonly IConfiguration _config;
        public PublikacijaUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Publikacija source, PublikacijeToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.Path) && source.Fajl != null)
            {
                return _config["ApiUrl"] + source.Path;
            }
            return _config["ApiUrl"] + "fajlovi/placeholder.png";
        }
    }
}