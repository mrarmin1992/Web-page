using System;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;

namespace API.Helpers
{
    public class KursAktivanResolver : IValueResolver<Kurs, KurseviToReturnDto, bool>
    {

        public bool Resolve(Kurs source, KurseviToReturnDto destination, bool destMember, ResolutionContext context)
        {
            if (DateTime.Compare(source.DatumPocetka, DateTime.Now) <= 0)
            {
                return false;
            }
            return true;
        }
    }
}