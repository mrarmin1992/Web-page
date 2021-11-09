using System.Threading.Tasks;
using API.Dtos;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using API.Errors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using Core.Entities.Identity;
using System.Linq;
using System.Security.Claims;

namespace API.Controllers
{
    public class VijestiController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPhotoService _photoService;
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;
        public VijestiController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService, IConfiguration config, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _config = config;
            _photoService = photoService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET /api/vijesti/all
        [HttpGet("All")]
        public async Task<ActionResult<Pagination<VijestiToReturnDto>>> GetSveVijesti([FromQuery] VijestSpecParams vijestiParams)
        { 
            var spec = new VijestiSaKategorijomSpecification(vijestiParams, "");
            var countSpec = new VijestiSaKategorijomForCountSpecification(vijestiParams, "");

            var totalItems = await _unitOfWork.Repository<Vijest>().CountAsync(countSpec);
            var vijesti = await _unitOfWork.Repository<Vijest>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Vijest>, IReadOnlyList<VijestiToReturnDto>>(vijesti);
            return Ok(new Pagination<VijestiToReturnDto>(vijestiParams.PageIndex, vijestiParams.PageSize, totalItems, data));
        }

        // GET /api/vijesti
        [HttpGet]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<Pagination<VijestiToReturnDto>>> GetVijesti([FromQuery] VijestSpecParams vijestiParams)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName == "Admin")
            {
                var adminspec = new VijestiSaKategorijomAdminSpecification(vijestiParams);
                var adminCountSpec = new VijestiSaKategorijomAdminForCountSpecification(vijestiParams);
                var totalItems = await _unitOfWork.Repository<Vijest>().CountAsync(adminCountSpec);
                var vijesti = await _unitOfWork.Repository<Vijest>().ListAsync(adminspec);

                var data = _mapper.Map<IReadOnlyList<Vijest>, IReadOnlyList<VijestiToReturnDto>>(vijesti);
                return Ok(new Pagination<VijestiToReturnDto>(vijestiParams.PageIndex, vijestiParams.PageSize, totalItems, data));
            } 
            else 
            {
                var spec = new VijestiSaKategorijomSpecification(vijestiParams, user.DisplayName);
                var countSpec = new VijestiSaKategorijomForCountSpecification(vijestiParams, user.DisplayName);
                var totalItems = await _unitOfWork.Repository<Vijest>().CountAsync(countSpec);
                var vijesti = await _unitOfWork.Repository<Vijest>().ListAsync(spec);

                var data = _mapper.Map<IReadOnlyList<Vijest>, IReadOnlyList<VijestiToReturnDto>>(vijesti);
                return Ok(new Pagination<VijestiToReturnDto>(vijestiParams.PageIndex, vijestiParams.PageSize, totalItems, data));
            }
        }

        // GET /api/vijesti/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<VijestiToReturnDto>> GetVijest(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);
            
            if (user.DisplayName == "Admin")
            {
                var adminSpec = new VijestiSaKategorijomAdminSpecification(id);
                var vijest = await _unitOfWork.Repository<Vijest>().GetEntityWithSpec(adminSpec);

                if (vijest == null)
                {
                    return NotFound();
                }

                return Ok(_mapper.Map<Vijest, VijestiToReturnDto>(vijest));
            }
            else
            {
                var spec = new VijestiSaKategorijomSpecification(id);
                var vijest = await _unitOfWork.Repository<Vijest>().GetEntityWithSpec(spec);
                if (vijest != null && vijest.Objavio != user.DisplayName) return BadRequest(new ApiResponse(401, "Niste autorizovani"));
                else if (vijest == null) return NotFound();
                else 
                {
                    return Ok(_mapper.Map<Vijest, VijestiToReturnDto>(vijest));
                }
            }
        }

        // GET /api/vijesti/vijestKategorije
        [HttpGet("VijestKategorije")]
        public async Task<ActionResult<IReadOnlyList<VijestKategorija>>> GetKategorije()
        {
            return Ok(await _unitOfWork.Repository<VijestKategorija>().ListAllAsync());
        }

        // POST /api/vijesti
        [HttpPost]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<Vijest>> CreateVijest(VijestCreateDto vijestCreate)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var vijest = _mapper.Map<VijestCreateDto, Vijest>(vijestCreate);
            vijest.ImageUrl = "images/vijesti/placeholder.png";
            vijest.Objavio = user.DisplayName;

            _unitOfWork.Repository<Vijest>().Add(vijest);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri kreiranju vijesti"));

            return Ok(vijest);
        }

        // PUT /api/vijesti/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<Vijest>> UpdateVijest(int id, VijestCreateDto vijestToUpdate)
        {
            var vijest = await _unitOfWork.Repository<Vijest>().GetByIdAsync(id);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != vijest.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            _mapper.Map(vijestToUpdate, vijest);
            var count = _config["ApiUrl"].Length;
            if (!string.IsNullOrEmpty(vijest.ImageUrl))
            {
                vijest.ImageUrl = vijest.ImageUrl.Substring(count);
            }
            else
            {
                vijest.ImageUrl = "images/vijesti/placeholder.png";
            }
            
            _unitOfWork.Repository<Vijest>().Update(vijest);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri izmjeni vijesti"));

            return Ok(vijest);
        }

        // DELETE /api/vijesti/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeleteVijest(int id)
        {
            var spec = new VijestiSaKategorijomSpecification(id);

            var vijest = await _unitOfWork.Repository<Vijest>().GetEntityWithSpec(spec);

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != vijest.Objavio)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            var photoToRemove = vijest.Photo;
            if (photoToRemove != null)
            {
                _photoService.DeleteFromDisk(vijest.Photo, "vijesti");
                vijest.RemovePhoto();
                _unitOfWork.Repository<Vijest>().Delete(vijest);
                _unitOfWork.Repository<Photo>().Delete(photoToRemove);
            } 
            else
            {
                _unitOfWork.Repository<Vijest>().Delete(vijest);
            }

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri brisanju vijesti"));

            return Ok();
        }

        // PUT /api/vijesti/{id}/photo
        [HttpPut("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult<VijestiToReturnDto>> AddVijestPhoto(int id, [FromForm] PhotoDto photoDto)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);
            
            var spec = new VijestiSaKategorijomSpecification(id, user.DisplayName);
            var vijest = await _unitOfWork.Repository<Vijest>().GetEntityWithSpec(spec);

            if (photoDto.Photo.Length > 0)
            {
                var photo = await _photoService.SaveToDiskAsync(photoDto.Photo, "vijesti");

                if (photo != null)
                {
                    var oldPhoto = new Photo();
                    if (vijest.Photo != null)
                    {
                        oldPhoto = vijest.Photo;
                        _photoService.DeleteFromDisk(vijest.Photo, "vijesti");
                        vijest.RemovePhoto();
                    }
                    vijest.ImageUrl = photo.PictureUrl;
                    vijest.AddPhoto(photo.PictureUrl, photo.FileName);

                    _unitOfWork.Repository<Vijest>().Update(vijest);
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
            return _mapper.Map<Vijest, VijestiToReturnDto>(vijest);
        }

        // DELETE /api/vijesti/{id}/photo
        [HttpDelete("{id}/photo")]
        [Authorize(Roles = "Member,Admin")]
        public async Task<ActionResult> DeleteVijestPhoto(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new VijestiSaKategorijomSpecification(id, user.DisplayName);
            var vijest = await _unitOfWork.Repository<Vijest>().GetEntityWithSpec(spec);

            var photo = vijest.Photo;

            if (photo != null)
            {
                _photoService.DeleteFromDisk(photo, "vijesti");
                vijest.RemovePhoto();
                vijest.ImageUrl = "images/vijesti/placeholder.png";
            
                _unitOfWork.Repository<Vijest>().Update(vijest);
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