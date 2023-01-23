using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        public ITokenService _tokenService ;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;
        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<TokenDTO>> Register(RegisterDTO register)
        {
            if(await UserExists(register.Username))
            {
                return BadRequest("Username is Taken");
            }
        
            var user = _mapper.Map<AppUser>(register);

            var result = await _userManager.CreateAsync(user, register.Password);
           
            if(!result.Succeeded) return BadRequest(result.Errors);
            
            var roleResult = await _userManager.AddToRoleAsync(user, "Member");
           
           if(!roleResult.Succeeded) return BadRequest(result.Errors);

            return new TokenDTO
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<TokenDTO>> login(LoginDTO login)
        {
            var user = await _userManager.Users
            .Include(p=>p.Photos)
            .SingleOrDefaultAsync(x=>x.UserName == login.Username.ToLower());
            if(user == null) return Unauthorized("Username is invalid");

            var result = await _userManager.CheckPasswordAsync(user, login.Password );

            if(!result) return Unauthorized("Invalid Password!");

             return new TokenDTO
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            };
        }

        private async Task<bool> UserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x=>x.UserName==username.ToLower());
        }
    }
}