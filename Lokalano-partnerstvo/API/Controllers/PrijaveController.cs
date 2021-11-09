using System;
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

namespace API.Controllers
{
    public class PrijaveController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<AppUser> _userManager;
        public PrijaveController(IUnitOfWork unitOfWork, IMapper mapper, UserManager<AppUser> userManager)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // GET /api/prijave/count
        [HttpGet("count")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult<int>> GetPrijaveCount()
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var countSpec = new PrijaveCountSpecification(user.DisplayName);

            var totalItems = await _unitOfWork.Repository<Prijava>().CountAsync(countSpec);

            return Ok(totalItems);
        }

        // GET /api/prijave/pregled
        [HttpGet("pregled")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult<Pagination<PrijaveToReturnDto>>> GetPrijavePregled([FromQuery] PrijavaSpecParams prijaveParams)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new PrijaveSpecification(prijaveParams, user.DisplayName);
            var countSpec = new PrijaveForCountSpecification(prijaveParams, user.DisplayName);

            var totalItems = await _unitOfWork.Repository<Prijava>().CountAsync(countSpec);
            var prijave = await _unitOfWork.Repository<Prijava>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Prijava>, IReadOnlyList<PrijaveToReturnDto>>(prijave);

            return Ok(new Pagination<PrijaveToReturnDto>(prijaveParams.PageIndex, prijaveParams.PageSize, totalItems, data));
        }

        // GET /api/prijave
        [HttpGet]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult<Pagination<PrijaveToReturnDto>>> GetPrijave([FromQuery] PrijavaSpecParams prijaveParams)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new PrijaveSaKursomIliObukomSpecification(prijaveParams, user.DisplayName);
            var countSpec = new PrijaveSaKursomIliObukomForCountSpecification(prijaveParams, user.DisplayName);
            var totalItems = await _unitOfWork.Repository<Prijava>().CountAsync(countSpec);
            var prijave = await _unitOfWork.Repository<Prijava>().ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<Prijava>, IReadOnlyList<PrijaveToReturnDto>>(prijave);

            return Ok(new Pagination<PrijaveToReturnDto>(prijaveParams.PageIndex, prijaveParams.PageSize, totalItems, data));
        }

        // GET /api/prijave/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PrijaveToReturnDto>> GetPrijava(int id)
        {
            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            var spec = new PrijaveSpecification(id);

            var prijava = await _unitOfWork.Repository<Prijava>().GetEntityWithSpec(spec);

            if (prijava != null && prijava.Objava != user.DisplayName) return BadRequest(new ApiResponse(401, "Niste autorizovani"));
            else if (prijava == null) return NotFound();
            else
            {
                return Ok(_mapper.Map<Prijava, PrijaveToReturnDto>(prijava));
            }
        }


        //POST /api/prijave
        [HttpPost]
        public async Task<ActionResult<Prijava>> CreatePrijava(PrijavaCreateDto prijavaCreate)
        {
            var prijava = _mapper.Map<PrijavaCreateDto, Prijava>(prijavaCreate);

            if (prijavaCreate.KursId == null)
            {
                int id = prijavaCreate.ObukaId == null ? default(int) : prijavaCreate.ObukaId.Value;
                var obuka = await _unitOfWork.Repository<Obuka>().GetByIdAsync(id);
                prijava.Obuka = obuka;
                prijava.Objava = obuka.Objavio;
                prijava.DatumPrijave = DateTime.Now;
            }
            else if (prijava.ObukaId == null)
            {
                int id = prijavaCreate.KursId == null ? default(int) : prijavaCreate.KursId.Value;
                var kurs = await _unitOfWork.Repository<Kurs>().GetByIdAsync(id);
                prijava.Kurs = kurs;
                prijava.Objava = kurs.Objavio;
                prijava.DatumPrijave = DateTime.Now;
            }

            _unitOfWork.Repository<Prijava>().Add(prijava);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri kreiranju prijave"));

            return Ok(prijava);
        }

        // PUT /api/prijave/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult<Prijava>> UpdatePrijava(int id, PrijavaCreateDto prijavaToUpdate)
        {
            var prijava = await _unitOfWork.Repository<Prijava>().GetByIdAsync(id);

            if (prijava == null)
            {
                return NotFound();
            }

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != prijava.Objava)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }

            _mapper.Map(prijavaToUpdate, prijava);
            prijava.Objava = user.DisplayName;

            _unitOfWork.Repository<Prijava>().Update(prijava);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri izmjeni prijave"));

            return Ok(prijava);
        }

        // DELETE /api/prijave/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<ActionResult> DeletePrijava(int id)
        {
            var prijava = await _unitOfWork.Repository<Prijava>().GetByIdAsync(id);

            if (prijava == null)
            {
                return NotFound();
            }

            var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
            var user = await _userManager.FindByEmailAsync(email);

            if (user.DisplayName != "Admin" && user.DisplayName != prijava.Objava)
            {
                return BadRequest(new ApiResponse(401, "Nista Autorizovani"));
            }
            _unitOfWork.Repository<Prijava>().Delete(prijava);

            var result = await _unitOfWork.Complete();

            if (result <= 0) return BadRequest(new ApiResponse(400, "Greška pri brisanju prijave"));

            return Ok();
        }

    }
}