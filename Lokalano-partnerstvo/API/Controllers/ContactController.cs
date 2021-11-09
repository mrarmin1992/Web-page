using System;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
    public class ContactController : BaseApiController
    {
        public IMailService _mailService;
        private readonly IConfiguration _config;
        public ContactController(IConfiguration config, IMailService mailService)
        {
            _config = config;
            _mailService = mailService;
        }

        [HttpPost]
        public async Task<IActionResult> GetMessage(Contact contact)
        {
          try
          {
            await _mailService.SendWelcomeEmailAsync(contact);
            return Ok();
          } catch (Exception)
            {
            throw;
          }
            
        }
    }
}