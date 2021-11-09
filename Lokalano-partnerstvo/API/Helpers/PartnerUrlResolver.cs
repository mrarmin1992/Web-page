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
    public class PartnerUrlResolver : IValueResolver<Partner, PartnerToReturnDto, string>
    {
        private readonly IConfiguration _config;
        public PartnerUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Partner source, PartnerToReturnDto destination, string destMember, ResolutionContext context)
        {
            if (!string.IsNullOrEmpty(source.ImageUrl) && source.Photo != null)
            {
                return _config["ApiUrl"] + source.ImageUrl;
            }
            return _config["ApiUrl"] + "images/partneri/placeholder.png";
        }
    }
}