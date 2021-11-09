using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

namespace API.Helpers
{
     public class MappingProfiles : Profile
     {
          public MappingProfiles()
          {
               CreateMap<AppUser, AllUsersDto>();
               CreateMap<Kurs, KurseviToReturnDto>()
                    .ForMember(d => d.KursKategorija, o => o.MapFrom(s => s.KursKategorija.Naziv))
                    .ForMember(d => d.ImageUrl, o => o.MapFrom<KursUrlResolver>())
                    .ForMember(d => d.Aktivan, o => o.MapFrom<KursAktivanResolver>());

               CreateMap<Vijest, VijestiToReturnDto>()
                    .ForMember(d => d.VijestKategorija, o => o.MapFrom(s => s.VijestKategorija.Naziv))
                    .ForMember(d => d.VijestKategorijaId, o => o.MapFrom(s => s.VijestKategorija.Id))
                    .ForMember(d => d.ImageUrl, o => o.MapFrom<VijestUrlResolver>());

               CreateMap<Obuka, ObukaToReturnDto>()
                    .ForMember(d => d.ObukaKategorija, o => o.MapFrom(s => s.ObukaKategorija.Naziv))
                    .ForMember(d => d.ImageUrl, o => o.MapFrom<ObukaUrlResolver>())
                    .ForMember(d => d.Aktivan, o => o.MapFrom<ObukaAktivnaResolver>());

               CreateMap<Dogadjaj, DogadjajiToReturnDto>()
                    .ForMember(d => d.DogadjajKategorija, o => o.MapFrom(s => s.DogadjajKategorija.Naziv))
                    .ForMember(d => d.ImageUrl, o => o.MapFrom<DogadjajUrlResolver>());

               CreateMap<Prijava, PrijaveToReturnDto>();
                    // .ForMember(d => d.Kurs, o => o.MapFrom(s => s.Kurs.Naziv))
                    // .ForMember(d => d.Obuka, o => o.MapFrom(s => s.Obuka.Naziv));

               CreateMap<Publikacija, PublikacijeToReturnDto>()
                    .ForMember(d => d.Path, o => o.MapFrom<PublikacijaUrlResolver>())
                    .ForMember(d => d.FileName, o => o.MapFrom(s => s.Fajl.OriginalFileName))
                    .ForMember(d => d.PhotoPath, o => o.MapFrom<PublikacijaPhotoUrlResolver>());
               
               CreateMap<Partner, PartnerToReturnDto>()
               .ForMember(d => d.ImageUrl, o => o.MapFrom<PartnerUrlResolver>());

               CreateMap<Partner, PartneriImeToReturnDto>();

               CreateMap<VijestCreateDto, Vijest>();
               CreateMap<KursCreateDto, Kurs>();
               CreateMap<ObukaCreateDto, Obuka>();
               CreateMap<DogadjajCreateDto, Dogadjaj>();
               CreateMap<PrijavaCreateDto, Prijava>();
               CreateMap<PublikacijaCreateDto, Publikacija>();
               CreateMap<PartnerCreateDto, Partner>();
               CreateMap<PartnerUpdateDto, Partner>();

               CreateMap<Photo, PhotoToReturnDto>()
                    .ForMember(d => d.PictureUrl, o => o.MapFrom<PhotoUrlResolver>());

               CreateMap<Fajl, FileToReturnDto>()
                    .ForMember(d => d.FileUrl, o => o.MapFrom<FileUrlResolver>());
          }
     }
}