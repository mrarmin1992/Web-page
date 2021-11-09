using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
    public class ObukaController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        private readonly IPhotoService _photoService;
        public ObukaController(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration config, UserManager<AppUser> userManager, IPhotoService photoService)
        {
            _photoService = photoService;
            _userManager = userManager;
            _config = config;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET /api/obuka/all
        [HttpGet("All")]
        public async Task<ActionResult<Pagination<ObukaToReturnDto>>> GetSveObuke([FromQuery] ObukaSpecParams obukaParams)
        {
            var spec = new ObukaSaKategorijomSpecification(obukaParams, "");
            var countSpec = new ObukaSaKategorijomForCountSpecification(obukaParams, "");

            var totalItems = await _unitOfWork.Repository<Obuka>().CountAsync(countSpec);
            var obuke = await _unitOfWork.Repository<Obuka>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Obuka>, IReadOnlyList<ObukaToReturnDto>>(obuke);

            return Ok(new Pagination<ObukaToReturnDto>(obukaParams.PageIndex, obukaParams.PageSize, totalItems, data));
        }

        // GET /api/obuka
        [HttpGet]
        [Authorize(Roles = "Admin,Member")]
        public async Task<ActionResult<Pagination<ObukaToReturnDto>>> GetObuke([FromQuery] ObukaSpecParams obukaParams)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminSpec = new ObukaSaKategorijomAdminSpecification(obukaParams);
                var adminCountSpec = new ObukaSaKategorijomAdminForCountSpecification(obukaParams);
                var totalItems = await _unitOfWork.Repository<Obuka>().CountAsync(adminCountSpec);
                var obuke = await _unitOfWork.Repository<Obuka>().ListAsync(adminSpec);

                var data = _mapper.Map<IReadOnlyList<Obuka>, IReadOnlyList<ObukaToReturnDto>>(obuke);

                return Ok(new Pagination<ObukaToReturnDto>(obukaParams.PageIndex, obukaParams.PageSize, totalItems, data));
            }
            else
            {
                var spec = new ObukaSaKategorijomSpecification(obukaParams, user.DisplayName);
                var countSpec = new ObukaSaKategorijomForCountSpecification(obukaParams, user.DisplayName);

                var totalItems = await _unitOfWork.Repository<Obuka>().CountAsync(countSpec);
                var obuke = await _unitOfWork.Repository<Obuka>().ListAsync(spec);

                var data = _mapper.Map<IReadOnlyList<Obuka>, IReadOnlyList<ObukaToReturnDto>>(obuke);

                return Ok(new Pagination<ObukaToReturnDto>(obukaParams.PageIndex, obukaParams.PageSize, totalItems, data));
            }
        }

        // GET /api/obuka/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ObukaToReturnDto>> GetObuka(int id)
        {
            /*var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminSpec = new ObukaSaKategorijomAdminSpecification(id);
                var obuka = await _unitOfWork.Repository<Obuka>().GetEntityWithSpec(adminSpec);

                if (obuka == null) return NotFound();

                return _mapper.Map<Obuka, ObukaToReturnDto>(obuka);
            }
            else
            {
                var spec = new ObukaSaKategorijomSpecification(id);
                var obuka = await _unitOfWork.Repository<Obuka>().GetEntityWithSpec(spec);

                if (obuka != null && obuka.Objavio != user.DisplayName) return BadRequest(new ApiResponse(401, "Niste autorizovani"));
                else if (obuka == null) return NotFound();
                else
                {
                    return Ok(_mapper.Map<Obuka, ObukaToReturnDto>(obuka));
                }
            }*/
            var spec = new ObukaSaKategorijomSpecification(id);
            var obuka = await _unitOfWork.Repository<Obuka>().GetEntityWithSpec(spec);

            if (obuka == null) return NotFound();
            else
            {
                return Ok(_mapper.Map<Obuka, ObukaToReturnDto>(obuka));
            }
        }

        // GET /api/obuka/{id}/prijava
        [HttpGet("{id}/prijava")]
        public async Task<ActionResult<ObukaToReturnDto>> GetObukaPrijava(int id)
        {
                var spec = new ObukaSaKategorijomSpecification(id);
                var obuka = await _unitOfWork.Repository<Obuka>().GetEntityWithSpec(spec);

                if (obuka == null) return NotFound();
                else
                {
                    return Ok(_mapper.Map<Obuka, ObukaToReturnDto>(obuka));
                }
        }

        // GET /api​/Obuka​/ObukaKategorije
        [HttpGet("ObukaKategorije")]
        public async Task<ActionResult<IReadOnlyList<ObukaKategorija>>> GetKategorije()
        {
            return Ok(await _unitOfWork.Repository<ObukaKategorija>().ListAllAsync());
        }

        // POST /api/obuka
        [HttpPost]
        [Authorize(Roles = "Admin,Member")]
        public async Task<ActionResult<Obuka>> CreateObuka(ObukaCreateDto obukaCreate)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var obuka = _mapper.Map<ObukaCreateDto, Obuka>(obukaCreate);
            obuka.ImageUrl = "images/obuke/placeholder.png";
            obuka.Objavio = user.DisplayName;

            _unitOfWork.Repository<Obuka>().Add(obuka);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri kreiranju obuke"));

            return Ok(obuka);
        }

        // PUT /api/obuka/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<Obuka>> UpdateObuka(int id, ObukaCreateDto obukaToUpdate)
        {
            var obuka = await _unitOfWork.Repository<Obuka>().GetByIdAsync(id);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != obuka.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            _mapper.Map(obukaToUpdate, obuka);

            var count = _config["ApiUrl"].Length;
            if (!string.IsNullOrEmpty(obuka.ImageUrl))
            {
                obuka.ImageUrl = obuka.ImageUrl.Substring(count);
            }
            else
            {
                obuka.ImageUrl = "images/obuke/placeholder.png";
            }

            _unitOfWork.Repository<Obuka>().Update(obuka);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri izmjeni obuke"));

            return Ok(obuka);
        }

        // DELETE /api/obuka/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteObuka(int id)
        {
            var spec = new ObukaSaKategorijomSpecification(id);
            var obuka = await _unitOfWork.Repository<Obuka>().GetEntityWithSpec(spec);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != obuka.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            var photoToRemove = obuka.Photo;
            if (photoToRemove != null)
            {
                _photoService.DeleteFromDisk(obuka.Photo, "obuke");
                obuka.RemovePhoto();

                _unitOfWork.Repository<Obuka>().Delete(obuka);
                _unitOfWork.Repository<Photo>().Delete(photoToRemove);
            }
            else
            {
                _unitOfWork.Repository<Obuka>().Delete(obuka);
            }

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri brisanju obuke"));

            return Ok();
        }

        // PUT /api/obuka/{id}/photo
        [HttpPut("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<ObukaToReturnDto>> AddObukaPhoto(int id, [FromForm] PhotoDto photoDto)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new ObukaSaKategorijomSpecification(id, user.DisplayName);
            var obuka = await _unitOfWork.Repository<Obuka>().GetEntityWithSpec(spec);

            if (photoDto.Photo.Length > 0)
            {
                var photo = await _photoService.SaveToDiskAsync(photoDto.Photo, "obuke");

                if (photo != null)
                {
                    var oldPhoto = new Photo();
                    if (obuka.Photo != null)
                    {
                        oldPhoto = obuka.Photo;
                        _photoService.DeleteFromDisk(obuka.Photo, "obuke");
                        obuka.RemovePhoto();
                    }
                    obuka.ImageUrl = photo.PictureUrl;
                    obuka.AddPhoto(photo.PictureUrl, photo.FileName);

                    _unitOfWork.Repository<Obuka>().Update(obuka);
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
            return _mapper.Map<Obuka, ObukaToReturnDto>(obuka);
        }

        // DELETE /api/obuka/{id}/photo
        [HttpDelete("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeleteObukaPhoto(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new ObukaSaKategorijomSpecification(id, user.DisplayName);
            var obuka = await _unitOfWork.Repository<Obuka>().GetEntityWithSpec(spec);

            var photo = obuka.Photo;

            if (photo != null)
            {
                _photoService.DeleteFromDisk(photo, "obuke");
                _unitOfWork.Repository<Photo>().Delete(photo);
            }
            else
            {
                return BadRequest(new ApiResponse(400, "Slika ne postoji"));
            }

            obuka.RemovePhoto();
            obuka.ImageUrl = "images/obuke/placeholder.png";

            _unitOfWork.Repository<Obuka>().Update(obuka);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri brisanju slike"));

            return Ok();
        }

    }
}