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
    public class DogadjajiController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        public DogadjajiController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService, IConfiguration config, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _config = config;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET /api/dogadjaji/All
        [HttpGet("All")]
        public async Task<ActionResult<Pagination<DogadjajiToReturnDto>>> GetAllDogadjaji([FromQuery] DogadjajSpecParams dogadjajParams)
        {
            var spec = new DogadjajSaKategorijomSpecification(dogadjajParams, "");
            var countSpec = new DogadjajSaKategorijomForCountSpecification(dogadjajParams, "");

            var totalItems = await _unitOfWork.Repository<Dogadjaj>().CountAsync(countSpec);
            var dogadjaji = await _unitOfWork.Repository<Dogadjaj>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Dogadjaj>, IReadOnlyList<DogadjajiToReturnDto>>(dogadjaji);

            return Ok(new Pagination<DogadjajiToReturnDto>(dogadjajParams.PageIndex, dogadjajParams.PageSize, totalItems, data));
        }

        // GET /api/dogadjaji
        [HttpGet]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult<Pagination<DogadjajiToReturnDto>>> GetDogadjaji([FromQuery] DogadjajSpecParams dogadjajParams)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminSpec = new DogadjajSaKategorijomAdminSpecification(dogadjajParams);
                var adminCountSpec = new DogadjajSaKategorijomAdminForCountSpecification(dogadjajParams);
                var totalItems = await _unitOfWork.Repository<Dogadjaj>().CountAsync(adminCountSpec);
                var dogadjaji = await _unitOfWork.Repository<Dogadjaj>().ListAsync(adminSpec);

                var data = _mapper.Map<IReadOnlyList<Dogadjaj>, IReadOnlyList<DogadjajiToReturnDto>>(dogadjaji);

                return Ok(new Pagination<DogadjajiToReturnDto>(dogadjajParams.PageIndex, dogadjajParams.PageSize, totalItems, data));
            }
            else
            {
                var spec = new DogadjajSaKategorijomSpecification(dogadjajParams, user.DisplayName);
                var countSpec = new DogadjajSaKategorijomForCountSpecification(dogadjajParams, user.DisplayName);

                var totalItems = await _unitOfWork.Repository<Dogadjaj>().CountAsync(countSpec);
                var dogadjaji = await _unitOfWork.Repository<Dogadjaj>().ListAsync(spec);

                var data = _mapper.Map<IReadOnlyList<Dogadjaj>, IReadOnlyList<DogadjajiToReturnDto>>(dogadjaji);

                return Ok(new Pagination<DogadjajiToReturnDto>(dogadjajParams.PageIndex, dogadjajParams.PageSize, totalItems, data));
            }

        }

        // GET /api/dogadjaji/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DogadjajiToReturnDto>> GetDogadjaj(int id)
        {
            /*var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminSpec = new DogadjajSaKategorijomAdminSpecification(id);
                var dogadjaj = await _unitOfWork.Repository<Dogadjaj>().GetEntityWithSpec(adminSpec);

                if (dogadjaj == null) return NotFound();

                return Ok(_mapper.Map<Dogadjaj, DogadjajiToReturnDto>(dogadjaj));
            }
            else
            {
                var spec = new DogadjajSaKategorijomSpecification(id);
                var dogadjaj = await _unitOfWork.Repository<Dogadjaj>().GetEntityWithSpec(spec);

                if (dogadjaj != null && dogadjaj.Objavio != user.DisplayName) return BadRequest(new ApiResponse(401, "Niste autorizovani"));
                else if (dogadjaj == null) return NotFound();
                else
                {
                    return Ok(_mapper.Map<Dogadjaj, DogadjajiToReturnDto>(dogadjaj));
                }
            }*/
            var spec = new DogadjajSaKategorijomSpecification(id);
            var dogadjaj = await _unitOfWork.Repository<Dogadjaj>().GetEntityWithSpec(spec);

            if (dogadjaj == null) return NotFound();
            else
            {
                return Ok(_mapper.Map<Dogadjaj, DogadjajiToReturnDto>(dogadjaj));
            }
        }

        // GET /api/dogadjaji/dogadjajKategorije
        [HttpGet("DogadjajKategorije")]
        public async Task<ActionResult<IReadOnlyList<DogadjajKategorija>>> GetKategorije()
        {
            return Ok(await _unitOfWork.Repository<DogadjajKategorija>().ListAllAsync());
        }

        // POST /api/dogadjaji
        [HttpPost]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<Dogadjaj>> CreateDogadjaj(DogadjajCreateDto dogadjajCreate)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var dogadjaj = _mapper.Map<DogadjajCreateDto, Dogadjaj>(dogadjajCreate);
            dogadjaj.ImageUrl = "images/vijesti/placeholder.png";
            dogadjaj.Objavio = user.DisplayName;

            _unitOfWork.Repository<Dogadjaj>().Add(dogadjaj);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri kreiranju događaja"));

            return Ok(dogadjaj);
        }

        // PUT /api/dogadjaji/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult<Dogadjaj>> UpdateDogadjaj(int id, DogadjajCreateDto dogadjajToUpdate)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var dogadjaj = await _unitOfWork.Repository<Dogadjaj>().GetByIdAsync(id);

            if (user.DisplayName != "Admin" && user.DisplayName != dogadjaj.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            _mapper.Map(dogadjajToUpdate, dogadjaj);
            var count = _config["ApiUrl"].Length;
            if (!string.IsNullOrEmpty(dogadjaj.ImageUrl))
            {
                dogadjaj.ImageUrl = dogadjaj.ImageUrl.Substring(count);
            }
            else
            {
                dogadjaj.ImageUrl = "images/dogadjaji/placeholder.png";
            }

            _unitOfWork.Repository<Dogadjaj>().Update(dogadjaj);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri izmjeni događaja"));

            return Ok(dogadjaj);
        }

        //DELETE /api/dogadjaji/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult> DeleteDogadjaj(int id)
        {
            var spec = new DogadjajSaKategorijomSpecification(id);
            var dogadjaj = await _unitOfWork.Repository<Dogadjaj>().GetEntityWithSpec(spec);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != dogadjaj.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            var photoToRemove = dogadjaj.Photo;
            if (photoToRemove != null)
            {
                _photoService.DeleteFromDisk(dogadjaj.Photo, "dogadjaji");
                dogadjaj.RemovePhoto();

                _unitOfWork.Repository<Dogadjaj>().Delete(dogadjaj);
                _unitOfWork.Repository<Photo>().Delete(photoToRemove);
            }
            else
            {
                _unitOfWork.Repository<Dogadjaj>().Delete(dogadjaj);
            }

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri brisanju događaja"));

            return Ok();
        }

        // PUT /api/dogadjaji/{id}/photo
        [HttpPut("{id}/photo")]
        public async Task<ActionResult<DogadjajiToReturnDto>> AddDogadjajPhoto(int id, [FromForm] PhotoDto photoDto)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new DogadjajSaKategorijomSpecification(id, user.DisplayName);
            var dogadjaj = await _unitOfWork.Repository<Dogadjaj>().GetEntityWithSpec(spec);

            if (photoDto.Photo.Length > 0)
            {
                var photo = await _photoService.SaveToDiskAsync(photoDto.Photo, "dogadjaji");

                if (photo != null)
                {
                    var oldPhoto = new Photo();
                    if (dogadjaj.Photo != null)
                    {
                        oldPhoto = dogadjaj.Photo;
                        _photoService.DeleteFromDisk(dogadjaj.Photo, "dogadjaji");
                        dogadjaj.RemovePhoto();
                    }
                    dogadjaj.ImageUrl = photo.PictureUrl;
                    dogadjaj.AddPhoto(photo.PictureUrl, photo.FileName);

                    _unitOfWork.Repository<Dogadjaj>().Update(dogadjaj);
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
            return _mapper.Map<Dogadjaj, DogadjajiToReturnDto>(dogadjaj);
        }

        // DELETE /api/dogadjaji/{id}/photo
        [HttpDelete("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeleteDogadjajPhoto(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new DogadjajSaKategorijomSpecification(id);
            var dogadjaj = await _unitOfWork.Repository<Dogadjaj>().GetEntityWithSpec(spec);

            if (dogadjaj != null && dogadjaj.Objavio != user.DisplayName) return BadRequest(new ApiResponse(401, "Niste autorizovani"));
            else if (dogadjaj == null) return NotFound();
            var photo = dogadjaj.Photo;

            if (photo != null)
            {
                _photoService.DeleteFromDisk(photo, "dogadjaji");
                _unitOfWork.Repository<Photo>().Delete(photo);
            }
            else
            {
                return BadRequest(new ApiResponse(400, "Slika ne postoji"));
            }

            dogadjaj.RemovePhoto();

            _unitOfWork.Repository<Dogadjaj>().Update(dogadjaj);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Problem pri brisanju slike"));

            return Ok();
        }
    }
}