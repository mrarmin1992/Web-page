using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManaer;
        private readonly ITokenService _tokenService;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IMailService _mailService;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManaer, ITokenService tokenService,
        IUserRepository userRepository, IMapper mapper, IMailService mailService)
        {
            _mailService = mailService;
            _mapper = mapper;
            _userRepository = userRepository;
            _tokenService = tokenService;
            _signInManaer = signInManaer;
            _userManager = userManager;
        }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Pagination<AllUsersDto>>> GetUsers(
        [FromQuery] UsersSpecParams usersParams
    )
    {
        var spec = new UsersSpecification(usersParams);
        var countSpec = new UsersForCountSpecification(usersParams);

        var totalItems = await _userRepository.CountAsync(countSpec);

        var users = await _userRepository.ListAsync(spec);

        var data = _mapper.Map<IReadOnlyList<AllUsersDto>>(users);

        return Ok(new Pagination<AllUsersDto>(usersParams.PageIndex,
                usersParams.PageSize, totalItems, data));
    }

    [HttpGet("user/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<KorisnikDto>> GetUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();
        
        return Ok(new KorisnikDto{
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email
        });
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var email = HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;

        var user = await _userManager.FindByEmailAsync(email);

        return new UserDto
        {
            Email = user.Email,
            Token = await _tokenService.CreateToken(user),
            DisplayName = user.DisplayName
        };
    }

    [HttpGet("emailexists")]
    public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
    {
        return await _userManager.FindByEmailAsync(email) != null;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null) return Unauthorized(new ApiResponse(401));

        var result = await _signInManaer.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded) return Unauthorized(new ApiResponse(401));

        return new UserDto
        {
            Email = user.Email,
            Token = await _tokenService.CreateToken(user),
            DisplayName = user.DisplayName
        };
    }
    [HttpPost("changepassword-admin")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDto>> ChangePassword([FromBody]LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null) return NotFound(new ApiResponse(404));

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);

        var result = await _userManager.ResetPasswordAsync(user, token, loginDto.Password);

        if (!result.Succeeded) return BadRequest(new ApiResponse(400));

        return new UserDto
        {
            Email = user.Email,
            Token = null,
            DisplayName = user.DisplayName
        };
    }

    [HttpPost("register")]
    public async Task<ActionResult<KorisnikDto>> Register(RegisterDto registerDto)
    {
        if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
        {
            return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Email address is in use" } });
        }
        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Email
        };
        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded) return BadRequest(new ApiResponse(400));

        var roleAddResult = await _userManager.AddToRoleAsync(user, "Member");

        if (!roleAddResult.Succeeded) return BadRequest("Failed to add to role");

        return new KorisnikDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Token = await _tokenService.CreateToken(user),
            Email = user.Email
        };
    }

    [HttpDelete("{email}")]
    public async Task<ActionResult> Delete(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return NotFound();
        var result = await _userManager.DeleteAsync(user);
        
        if (!result.Succeeded) return BadRequest(new ApiResponse(400));

        return Ok();
    }

    [HttpPost("ForgotPassword")]
		public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
			if (user == null)
				return BadRequest("Invalid Request");

			var token = await _userManager.GeneratePasswordResetTokenAsync(user);
			var param = new Dictionary<string, string>
			{
				{"token", token },
				{"email", forgotPasswordDto.Email }
			};

			var callback = QueryHelpers.AddQueryString(forgotPasswordDto.ClientURI, param);

			await _mailService.SendPasswordResetMailAsync(user.Email, callback);

			return Ok();
		}

        [HttpPost("ResetPassword")]
		public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
			if (user == null)
				return BadRequest("Invalid Request");
			var resetPassResult = await _userManager.ResetPasswordAsync(user, resetPasswordDto.Token, resetPasswordDto.Password);
			if (!resetPassResult.Succeeded)
			{
				var errors = resetPassResult.Errors.Select(e => e.Description);

				return BadRequest(new { Errors = errors });
			}

			await _userManager.SetLockoutEndDateAsync(user, new DateTime(2000, 1, 1));

			return Ok();
		}

        [HttpPost("LoggedResetPassword")]
        [Authorize(Roles = "Admin,Member")]
		public async Task<IActionResult> LoggedResetPassword([FromBody] LoggedResetPasswordDto resetPasswordDto)
		{
			if (!ModelState.IsValid)
				return BadRequest();

			var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
			if (user == null)
				return BadRequest("Invalid Request");
			var resetPassResult = await _userManager.ChangePasswordAsync(user, resetPasswordDto.Password, resetPasswordDto.NewPassword);
			if (!resetPassResult.Succeeded)
			{
				var errors = resetPassResult.Errors.Select(e => e.Description);

				return BadRequest(new { Errors = errors });
			}

			await _userManager.SetLockoutEndDateAsync(user, new DateTime(2000, 1, 1));

			return Ok();
		}
}
}