using System;
using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class ObukaAktivnaResolver : IValueResolver<Obuka, ObukaToReturnDto, bool>
    {

        public bool Resolve(Obuka source, ObukaToReturnDto destination, bool destMember, ResolutionContext context)
        {
            if (DateTime.Compare(source.DatumPocetka, DateTime.Now) <= 0)
            {
                return false;
            }
            return true;
        }
    }
}