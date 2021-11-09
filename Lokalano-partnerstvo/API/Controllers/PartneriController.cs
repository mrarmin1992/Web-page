using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
    public class PartneriController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly IConfiguration _config;
        public PartneriController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService, IConfiguration config)
        {
            _config = config;
            _photoService = photoService;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        // GET /api/partneri
        [HttpGet]
        public async Task<ActionResult<Pagination<PartnerToReturnDto>>> GetPartneri(
             [FromQuery] PartnerSpecParams partnerParams)
        {
            var spec = new PartnerSpecification(partnerParams);
            var countSpec = new PartnerForCountSpecification(partnerParams);
            var totalItems = await _unitOfWork.Repository<Partner>().CountAsync(countSpec);
            var partneri = await _unitOfWork.Repository<Partner>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Partner>, IReadOnlyList<PartnerToReturnDto>>(partneri);
            return Ok(new Pagination<PartnerToReturnDto>(partnerParams.PageIndex, partnerParams.PageSize, totalItems, data));
        }

        // GET /api/partneri/ime
        [HttpGet("ime")]
        public async Task<ActionResult<Pagination<PartneriImeToReturnDto>>> GetPartneriImena(
             [FromQuery] PartnerSpecParams partnerParams)
        {
            var spec = new PartnerSpecification(partnerParams);
            var countSpec = new PartnerForCountSpecification(partnerParams);
            var totalItems = await _unitOfWork.Repository<Partner>().CountAsync(countSpec);
            var partneri = await _unitOfWork.Repository<Partner>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Partner>, IReadOnlyList<PartneriImeToReturnDto>>(partneri);
            // return Ok(new Pagination<PartneriImeToReturnDto>(partnerParams.PageIndex, partnerParams.PageSize, totalItems, data));
            return Ok(data);
        }

        // GET /api/partneri/{{email}}
        [HttpGet("{email}")]
        public async Task<ActionResult<PartnerToReturnDto>> GetPartner(string email)
        {
            var spec = new PartnerSpecification(email);
            var partner = await _unitOfWork.Repository<Partner>().GetEntityWithSpec(spec);
            
            if (partner == null) return NotFound();

            var data = _mapper.Map<Partner, PartnerToReturnDto>(partner);
            return Ok(data);
        }

        // POST /api/partneri
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Partner>> CreatePartner(PartnerCreateDto partnerCreate)
        {
            var partner = _mapper.Map<PartnerCreateDto, Partner>(partnerCreate);
            partner.ImageUrl = "images/partneri/placeholder.png";

            _unitOfWork.Repository<Partner>().Add(partner);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri kreiranju partnera"));

            return Ok(partner);
        }

        // PUT /api/partneri/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<Partner>> UpdatePartner(int id, PartnerUpdateDto partnerToUpdate)
        {
            var partner = await _unitOfWork.Repository<Partner>().GetByIdAsync(id);

            if (partner == null) return NotFound();

            _mapper.Map(partnerToUpdate, partner);

            /*var count = _config["ApiUrl"].Length;
            if (!string.IsNullOrEmpty(partner.ImageUrl))
            {
                partner.ImageUrl = partner.ImageUrl.Substring(count);
            }
            else
            {
                partner.ImageUrl = "images/partneri/placeholder.png";
            }*/
            if (string.IsNullOrEmpty(partner.ImageUrl))
            {
                partner.ImageUrl = "images/partneri/placeholder.png";
            }

            _unitOfWork.Repository<Partner>().Update(partner);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri izmjeni partnera"));

            return Ok(partner);
        }

        // DELETE /api/partneri/{id}
        [HttpDelete("{email}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeletePartner(string email)
        {
            var spec = new PartnerSpecification(email);
            var partner = await _unitOfWork.Repository<Partner>().GetEntityWithSpec(spec);
            if (partner == null) return NotFound();

            var photoToRemove = partner.Photo;
            if (photoToRemove != null)
            {
                _photoService.DeleteFromDisk(partner.Photo, "partneri");
                partner.RemovePhoto();

                _unitOfWork.Repository<Partner>().Delete(partner);
                _unitOfWork.Repository<Photo>().Delete(photoToRemove);
            }
            else
            {
                _unitOfWork.Repository<Partner>().Delete(partner);
            }

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri brisanju partnera"));

            return Ok();
        }

        // PUT /api/partneri/{id}/photo
        [HttpPut("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<PartnerToReturnDto>> AddPartnerPhoto(int id, [FromForm] PhotoDto photoDto)
        {
            var spec = new PartnerSpecification(id);
            var partner = await _unitOfWork.Repository<Partner>().GetEntityWithSpec(spec);

            if (photoDto.Photo.Length > 0)
            {
                var photo = await _photoService.SaveToDiskAsync(photoDto.Photo, "partneri");

                if (photo != null)
                {
                    var oldPhoto = new Photo();
                    if (partner.Photo != null)
                    {
                        oldPhoto = partner.Photo;
                        _photoService.DeleteFromDisk(partner.Photo, "partneri");
                        partner.RemovePhoto();
                    }
                    partner.ImageUrl = photo.PictureUrl;
                    partner.AddPhoto(photo.PictureUrl, photo.FileName);

                    _unitOfWork.Repository<Partner>().Update(partner);
                    if (oldPhoto.PictureUrl != null)
                    {
                        _unitOfWork.Repository<Photo>().Delete(oldPhoto);
                    }
                    var result = await _unitOfWork.Complete();

                    if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri dodavanju slike"));
                }
                else
                {
                    return BadRequest(new ApiResponse(400, "Problem pri snimanju slike na disk"));
                }
            }
            return _mapper.Map<Partner, PartnerToReturnDto>(partner);
        }

        // DELETE /api/partneri/{id}/photo
        [HttpDelete("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeletePartnerPhoto(int id)
        {
            var spec = new PartnerSpecification(id);
            var partner = await _unitOfWork.Repository<Partner>().GetEntityWithSpec(spec);

            var photo = partner.Photo;

            if (photo != null)
            {
                _photoService.DeleteFromDisk(photo, "partneri");
                _unitOfWork.Repository<Photo>().Delete(photo);
            }
            else
            {
                return BadRequest(new ApiResponse(400, "Slika ne postoji"));
            }

            partner.RemovePhoto();
            partner.ImageUrl = "images/partneri/placeholder.png";

            _unitOfWork.Repository<Partner>().Update(partner);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri brisanju slike"));

            return Ok();
        }
    }
}