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
    public class PublikacijeController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IPhotoService _photoService;
        public PublikacijeController(IUnitOfWork unitOfWork, IMapper mapper, IFileService fileService, IConfiguration config, UserManager<AppUser> userManager, IPhotoService photoService)
        {
            _photoService = photoService;
            _config = config;
            _userManager = userManager;
            _fileService = fileService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET /api/publikacije/all
        [HttpGet("All")]
        public async Task<ActionResult<Pagination<PublikacijeToReturnDto>>> GetAllPublikacije([FromQuery] PublikacijeSpecParams publikacijeParams)
        {
            var spec = new PublikacijaSpecification(publikacijeParams, "");
            var countSpec = new PublikacijaForCountSpecification(publikacijeParams, "");

            var totalItems = await _unitOfWork.Repository<Publikacija>().CountAsync(countSpec);
            var publikacije = await _unitOfWork.Repository<Publikacija>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Publikacija>, IReadOnlyList<PublikacijeToReturnDto>>(publikacije);

            return Ok(new Pagination<PublikacijeToReturnDto>(publikacijeParams.PageIndex, publikacijeParams.PageSize, totalItems, data));
        }

        // GET /api/publikacije
        [HttpGet]
        public async Task<ActionResult<Pagination<PublikacijeToReturnDto>>> GetPublikacije([FromQuery] PublikacijeSpecParams publikacijeParams)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminSpec = new PublikacijaAdminSpecification(publikacijeParams);
                var adminCountSpec = new PublikacijaAdminForCountSpecification(publikacijeParams);

                var totalItems = await _unitOfWork.Repository<Publikacija>().CountAsync(adminCountSpec);
                var publikacije = await _unitOfWork.Repository<Publikacija>().ListAsync(adminSpec);

                var data = _mapper.Map<IReadOnlyList<Publikacija>, IReadOnlyList<PublikacijeToReturnDto>>(publikacije);

                return Ok(new Pagination<PublikacijeToReturnDto>(publikacijeParams.PageIndex, publikacijeParams.PageSize, totalItems, data));
            }
            else
            {
                var spec = new PublikacijaSpecification(publikacijeParams, user.DisplayName);
                var countSpec = new PublikacijaForCountSpecification(publikacijeParams, user.DisplayName);

                var totalItems = await _unitOfWork.Repository<Publikacija>().CountAsync(countSpec);
                var publikacije = await _unitOfWork.Repository<Publikacija>().ListAsync(spec);

                var data = _mapper.Map<IReadOnlyList<Publikacija>, IReadOnlyList<PublikacijeToReturnDto>>(publikacije);

                return Ok(new Pagination<PublikacijeToReturnDto>(publikacijeParams.PageIndex, publikacijeParams.PageSize, totalItems, data));
            }
        }

        // GET /api/publikacije/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PublikacijeToReturnDto>> GetPublikacija(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminSpec = new PublikacijaAdminSpecification(id);

                var publikacija = await _unitOfWork.Repository<Publikacija>().GetEntityWithSpec(adminSpec);

                if (publikacija == null) return NotFound();

                return _mapper.Map<Publikacija, PublikacijeToReturnDto>(publikacija);
            }
            else
            {
                var spec = new PublikacijaSpecification(id);

                var publikacija = await _unitOfWork.Repository<Publikacija>().GetEntityWithSpec(spec);

                if (publikacija != null && publikacija.Objavio != user.DisplayName) return BadRequest(new ApiResponse(401, "Niste autorizovani"));
                else if (publikacija == null) return NotFound();
                else
                {
                    return Ok(_mapper.Map<Publikacija, PublikacijeToReturnDto>(publikacija));
                }
            }

        }

        // POST /api/publikacije
        [HttpPost]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult<Publikacija>> CreatePublikacija(PublikacijaCreateDto publikacijaCreate)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var publikacija = _mapper.Map<PublikacijaCreateDto, Publikacija>(publikacijaCreate);

            publikacija.Path = "fajlovi/placeholder.png";
            publikacija.Objavio = user.DisplayName;
            publikacija.PhotoPath = "images/publikacije/placeholder.png";

            _unitOfWork.Repository<Publikacija>().Add(publikacija);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri kreiranju publikacije"));

            return Ok(publikacija);
        }

        // PUT /api/publikacije/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult<Publikacija>> UpdatePublikacija(int id, PublikacijaCreateDto publikacijaToUpdate)
        {
            var publikacija = await _unitOfWork.Repository<Publikacija>().GetByIdAsync(id);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != publikacija.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            _mapper.Map(publikacijaToUpdate, publikacija);
            var count = _config["ApiUrl"].Length;
            if (!string.IsNullOrEmpty(publikacija.Path))
            {
                if (!string.IsNullOrEmpty(publikacija.PhotoPath))
                {
                    publikacija.PhotoPath = publikacija.PhotoPath.Substring(count);
                }
                publikacija.Path = publikacija.Path.Substring(count);
            }
            else
            {
                publikacija.Path = "fajlovi/placeholder.png";
                publikacija.PhotoPath = "images/publikacije/placeholder.png";
            }

            _unitOfWork.Repository<Publikacija>().Update(publikacija);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri izmjeni publikacije"));

            return Ok(publikacija);
        }

        //DELETE /api/publikacije/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult> DeletePublikacija(int id)
        {
            var spec = new PublikacijaSpecification(id);

            var publikacija = await _unitOfWork.Repository<Publikacija>().GetEntityWithSpec(spec);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != publikacija.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            bool deleted = false;
            var fileToRemove = publikacija.Fajl;
            if (fileToRemove != null)
            {
                _fileService.DeleteFromDisk(publikacija.Fajl);
                publikacija.RemoveFajl();

                _unitOfWork.Repository<Publikacija>().Delete(publikacija);
                deleted = true;
                _unitOfWork.Repository<Fajl>().Delete(fileToRemove);
            }
            else
            {
                deleted = true;
                _unitOfWork.Repository<Publikacija>().Delete(publikacija);
            }
            var photoToRemove = publikacija.Photo;
            if (photoToRemove != null)
            {
                _photoService.DeleteFromDisk(publikacija.Photo, "publikacije");
                publikacija.RemovePhoto();

                if (!deleted)
                {
                    _unitOfWork.Repository<Publikacija>().Delete(publikacija);
                }
                _unitOfWork.Repository<Photo>().Delete(photoToRemove);
            }
            else
            {
                if (!deleted)
                {
                    _unitOfWork.Repository<Publikacija>().Delete(publikacija);
                }
            }


            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri brisanju publikacije"));

            return Ok();
        }

        // PUT /api/publikacije/{id}/file
        [HttpPut("{id}/file")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<PublikacijeToReturnDto>> AddPublikacija(int id, [FromForm] FileDto fileDto)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new PublikacijaSpecification(id, user.DisplayName);
            var publikacija = await _unitOfWork.Repository<Publikacija>().GetEntityWithSpec(spec);

            if (fileDto.fajl.Length > 0)
            {
                var fajl = await _fileService.SaveToDiskAsync(fileDto.fajl);

                if (fajl != null)
                {
                    var stariFajl = new Fajl();
                    if (publikacija.Fajl != null)
                    {
                        stariFajl = publikacija.Fajl;
                        _fileService.DeleteFromDisk(publikacija.Fajl);
                        publikacija.RemoveFajl();
                    }
                    publikacija.Path = fajl.FileUrl;
                    publikacija.AddFile(fajl.FileUrl, fajl.FileName, fajl.OriginalFileName);

                    _unitOfWork.Repository<Publikacija>().Update(publikacija);

                    if (stariFajl.FileUrl != null)
                    {
                        _unitOfWork.Repository<Fajl>().Delete(stariFajl);
                    }
                    var result = await _unitOfWork.Complete();

                    if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri dodavanju fajla"));
                }
                else
                {
                    return BadRequest(new ApiResponse(400, "Problem pri snimanju fajla na disk"));
                }
            }
            return _mapper.Map<Publikacija, PublikacijeToReturnDto>(publikacija);
        }

        // DELETE /api/publikacije/{id}/file
        [HttpDelete("{id}/file")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeletePublikacijaFile(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new PublikacijaSpecification(id, user.DisplayName);
            var publikacija = await _unitOfWork.Repository<Publikacija>().GetEntityWithSpec(spec);

            var fajl = publikacija.Fajl;

            if (fajl != null)
            {
                _fileService.DeleteFromDisk(fajl);
                publikacija.RemoveFajl();
                publikacija.Path = "fajlovi/placeholder.png";

                _unitOfWork.Repository<Publikacija>().Update(publikacija);
                _unitOfWork.Repository<Fajl>().Delete(fajl);
            }
            else
            {
                return BadRequest(new ApiResponse(400, "Fajl ne postoji"));
            }


            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri brisanju fajla"));

            return Ok();
        }

        // PUT /api/publikacije/{id}/photo
        [HttpPut("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<PublikacijeToReturnDto>> AddPublikacijaPhoto(int id, [FromForm] PhotoDto photoDto)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new PublikacijaSpecification(id, user.DisplayName);
            var publikacija = await _unitOfWork.Repository<Publikacija>().GetEntityWithSpec(spec);

            if (photoDto.Photo.Length > 0)
            {
                var photo = await _photoService.SaveToDiskAsync(photoDto.Photo, "publikacije");

                if (photo != null)
                {
                    var staraSlika = new Photo();
                    if (publikacija.Photo != null)
                    {
                        staraSlika = publikacija.Photo;
                        _photoService.DeleteFromDisk(publikacija.Photo, "publikacije");
                        publikacija.RemovePhoto();
                    }
                    publikacija.PhotoPath = photo.PictureUrl;
                    publikacija.AddPhoto(photo.PictureUrl, photo.FileName);

                    _unitOfWork.Repository<Publikacija>().Update(publikacija);

                    if (staraSlika.PictureUrl != null)
                    {
                        _unitOfWork.Repository<Photo>().Delete(staraSlika);
                    }
                    var result = await _unitOfWork.Complete();

                    if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri dodavanju slike"));
                }
                else
                {
                    return BadRequest(new ApiResponse(400, "Problem pri snimanju slike na disk"));
                }
            }
            return _mapper.Map<Publikacija, PublikacijeToReturnDto>(publikacija);
        }

        // DELETE /api/publikacije/{id}/photo
        [HttpDelete("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeletePublikacijaPhoto(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new PublikacijaSpecification(id, user.DisplayName);
            var publikacija = await _unitOfWork.Repository<Publikacija>().GetEntityWithSpec(spec);

            var photo = publikacija.Photo;

            if (photo != null)
            {
                _photoService.DeleteFromDisk(photo, "publikacije");
                publikacija.RemovePhoto();
                publikacija.PhotoPath = "images/publikacije/placeholder.png";

                _unitOfWork.Repository<Publikacija>().Update(publikacija);
                _unitOfWork.Repository<Photo>().Delete(photo);
            }
            else
            {
                return BadRequest(new ApiResponse(400, "Slika ne postoji"));
            }


            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri brisanju slike"));

            return Ok();
        }
    }
}