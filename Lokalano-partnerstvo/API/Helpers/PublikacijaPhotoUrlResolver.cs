using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class PublikacijaPhotoUrlResolver : IValueResolver<Publikacija, PublikacijeToReturnDto, string>
    {
        private readonly IConfiguration _config;
        public PublikacijaPhotoUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Publikacija source, PublikacijeToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.PhotoPath) && source.Photo != null)
            {
                return _config["ApiUrl"] + source.PhotoPath;
            }
            return _config["ApiUrl"] + "images/publikacije/placeholder.png";
        }
    }
}