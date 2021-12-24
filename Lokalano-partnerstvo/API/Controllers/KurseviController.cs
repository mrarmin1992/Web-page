using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using AutoMapper;
using API.Helpers;
using API.Errors;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using System.Security.Claims;

namespace API.Controllers
{
    public class KurseviController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;
        public KurseviController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService, IConfiguration config, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
            _config = config;
        }
        // GET /api/kursevi/all
        [HttpGet("All")]
        public async Task<ActionResult<Pagination<KurseviToReturnDto>>> GetAllKursevi(
             [FromQuery] KursSpecParams kursParams)
        {
            var spec = new KurseviSaKategorijomSpecification(kursParams, "");
            var countSpec = new KurseviSaKategorijomForCountSpecification(kursParams, "");

            var totalItems = await _unitOfWork.Repository<Kurs>().CountAsync(countSpec);
            var kursevi = await _unitOfWork.Repository<Kurs>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Kurs>, IReadOnlyList<KurseviToReturnDto>>(kursevi);
            return Ok(new Pagination<KurseviToReturnDto>(kursParams.PageIndex, kursParams.PageSize, totalItems, data));
        }
        // GET /api/kursevi
        [HttpGet]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<Pagination<KurseviToReturnDto>>> GetKursevi(
             [FromQuery] KursSpecParams kursParams)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminSpec = new KurseviSaKategorijomAdminSpecification(kursParams);
                var adminCountSpec = new KurseviSaKategorijomAdminForCountSpecification(kursParams);
                var totalItems = await _unitOfWork.Repository<Kurs>().CountAsync(adminCountSpec);
                var kursevi = await _unitOfWork.Repository<Kurs>().ListAsync(adminSpec);

                var data = _mapper.Map<IReadOnlyList<Kurs>, IReadOnlyList<KurseviToReturnDto>>(kursevi);
                return Ok(new Pagination<KurseviToReturnDto>(kursParams.PageIndex, kursParams.PageSize, totalItems, data));
            }
            else
            {
                var spec = new KurseviSaKategorijomSpecification(kursParams, user.DisplayName);
                var countSpec = new KurseviSaKategorijomForCountSpecification(kursParams, user.DisplayName);
                var totalItems = await _unitOfWork.Repository<Kurs>().CountAsync(countSpec);
                var kursevi = await _unitOfWork.Repository<Kurs>().ListAsync(spec);

                var data = _mapper.Map<IReadOnlyList<Kurs>, IReadOnlyList<KurseviToReturnDto>>(kursevi);
                return Ok(new Pagination<KurseviToReturnDto>(kursParams.PageIndex, kursParams.PageSize, totalItems, data));
            }
        }
        // GET /api/kursevi/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<KurseviToReturnDto>> GetKurs(int id)
        {
            /*var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminSpec = new KurseviSaKategorijomAdminSpecification(id);
                var kurs = await _unitOfWork.Repository<Kurs>().GetEntityWithSpec(adminSpec);

                if (kurs == null) return NotFound();
                return Ok(_mapper.Map<Kurs, KurseviToReturnDto>(kurs));
            }
            else
            {
                var spec = new KurseviSaKategorijomSpecification(id);
                var kurs = await _unitOfWork.Repository<Kurs>().GetEntityWithSpec(spec);
                if (kurs == null) return NotFound();
                else
                {
                    return Ok(_mapper.Map<Kurs, KurseviToReturnDto>(kurs));
                }
            }*/
            var spec = new KurseviSaKategorijomSpecification(id);
            var kurs = await _unitOfWork.Repository<Kurs>().GetEntityWithSpec(spec);
            if (kurs == null) return NotFound();
            else
            {
                return Ok(_mapper.Map<Kurs, KurseviToReturnDto>(kurs));
            }
        }
        // GET /api/kursevi/{id}/prijava
        [HttpGet("{id}/prijava")]
        public async Task<ActionResult<KurseviToReturnDto>> GetKursPrijava(int id)
        {
                var spec = new KurseviSaKategorijomSpecification(id);
                var kurs = await _unitOfWork.Repository<Kurs>().GetEntityWithSpec(spec);
                if (kurs == null) return NotFound();
                else
                {
                    return Ok(_mapper.Map<Kurs, KurseviToReturnDto>(kurs));
                }
        }
        // GET /api/kursevi/kursKategorije
        [HttpGet("KursKategorije")]
        public async Task<ActionResult<IReadOnlyList<KursKategorija>>> GetKategorije()
        {
            return Ok(await _unitOfWork.Repository<KursKategorija>().ListAllAsync());
        }
        // POST /api/kursevi
        [HttpPost]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<Kurs>> CreateKurs(KursCreateDto kursCreate)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var kurs = _mapper.Map<KursCreateDto, Kurs>(kursCreate);
            kurs.ImageUrl = "images/kursevi/placeholder.png";
            kurs.Objavio = user.DisplayName;

            _unitOfWork.Repository<Kurs>().Add(kurs);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri kreiranju vijesti"));

            return Ok(kurs);
        }
        // PUT /api/kursevi/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Member, Admin")]
        public async Task<ActionResult<Kurs>> UpdateKurs(int id, KursCreateDto kursToUpdate)
        {
            var kurs = await _unitOfWork.Repository<Kurs>().GetByIdAsync(id);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != kurs.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }
            
            _mapper.Map(kursToUpdate, kurs);

            var count = _config["ApiUrl"].Length;
            if (!string.IsNullOrEmpty(kurs.ImageUrl))
            {
                kurs.ImageUrl = kurs.ImageUrl.Substring(count);
            }
            else
            {
                kurs.ImageUrl = "images/kursevi/placeholder.png";
            }

            _unitOfWork.Repository<Kurs>().Update(kurs);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri izmjeni kursa"));

            return Ok(kurs);
        }

        // DELETE /api/kursevi/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeleteKurs(int id)
        {
            var spec = new KurseviSaKategorijomSpecification(id);
            var kurs = await _unitOfWork.Repository<Kurs>().GetEntityWithSpec(spec);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != kurs.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            var photoToRemove = kurs.Photo;
            if (photoToRemove != null)
            {
                _photoService.DeleteFromDisk(kurs.Photo, "kursevi");
                kurs.RemovePhoto();

                _unitOfWork.Repository<Kurs>().Delete(kurs);
                _unitOfWork.Repository<Photo>().Delete(photoToRemove);
            }
            else
            {
                _unitOfWork.Repository<Kurs>().Delete(kurs);
            }

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri brisanju kursa"));

            return Ok();
        }

        // PUT /api/kursevi/{id}/photo
        [HttpPut("{id}/photo")]
        public async Task<ActionResult<KurseviToReturnDto>> AddKursPhoto(int id, [FromForm] PhotoDto photoDto)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new KurseviSaKategorijomSpecification(id, user.DisplayName);
            var kurs = await _unitOfWork.Repository<Kurs>().GetEntityWithSpec(spec);

            if (photoDto.Photo.Length > 0)
            {
                var photo = await _photoService.SaveToDiskAsync(photoDto.Photo, "kursevi");

                if (photo != null)
                {
                    var oldPhoto = new Photo();
                    if (kurs.Photo != null)
                    {
                        oldPhoto = kurs.Photo;
                        _photoService.DeleteFromDisk(kurs.Photo, "kursevi");
                        kurs.RemovePhoto();
                    }
                    kurs.ImageUrl = photo.PictureUrl;
                    kurs.AddPhoto(photo.PictureUrl, photo.FileName);

                    _unitOfWork.Repository<Kurs>().Update(kurs);
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
            return _mapper.Map<Kurs, KurseviToReturnDto>(kurs);
        }

        // DELETE /api/kursevi/{id}/photo
        [HttpDelete("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeleteKursPhoto(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new KurseviSaKategorijomSpecification(id);
            var kurs = await _unitOfWork.Repository<Kurs>().GetEntityWithSpec(spec);

            if (kurs != null && kurs.Objavio != user.DisplayName) return BadRequest(new ApiResponse(401, "Niste autorizovani"));
            else if (kurs == null) return NotFound();
            var photo = kurs.Photo;

            if (photo != null)
            {
                _photoService.DeleteFromDisk(photo, "kursevi");
                _unitOfWork.Repository<Photo>().Delete(photo);
            }
            else
            {
                return BadRequest(new ApiResponse(400, "Slika ne postoji"));
            }

            kurs.RemovePhoto();

            _unitOfWork.Repository<Kurs>().Update(kurs);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri brisanju slike"));

            return Ok();
        }
    }
}