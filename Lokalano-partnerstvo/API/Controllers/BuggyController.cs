using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
     public class BuggyController : BaseApiController
     {
          private readonly MyContext _context;
          public BuggyController(MyContext context)
          {
               _context = context;
          }

          [HttpGet("notfound")]
          public ActionResult GetNotFoundRequest()
          {
               var thing = _context.Kursevi.Find(54);
               if (thing == null)
               {
                    return NotFound(new ApiResponse(404));
               }
               return Ok();
          }

          [HttpGet("servererror")]
          public ActionResult GetServerError()
          {
               var thing = _context.Kursevi.Find(54);
               var thingToReturn = thing.ToString();
               return Ok();
          }

          [HttpGet("badrequest")]
          public ActionResult GetBadRequest()
          {
               return BadRequest(new ApiResponse(400));
          }

          [HttpGet("badrequest/{id}")]
          public ActionResult GetNotFoundRequest(int id)
          {
               return Ok();
          }
     }
}