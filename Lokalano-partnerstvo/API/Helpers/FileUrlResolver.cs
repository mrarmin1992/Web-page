using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class FileUrlResolver : IValueResolver<Fajl, FileToReturnDto, string>
    {
        private readonly IConfiguration _config;
        public FileUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Fajl source, FileToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.FileUrl))
            {
                return _config["ApiUrl"] + source.FileUrl;
            }

            return null;
        }
    }
}