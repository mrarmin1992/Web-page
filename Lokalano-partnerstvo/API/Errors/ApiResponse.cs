using System;

namespace API.Errors
{
     public class ApiResponse
     {
          public ApiResponse(int statusCode, string message = null)
          {
               StatusCode = statusCode;
               Message = message ?? GetDefaultMessageForStatusCode(statusCode);
          }


          public int StatusCode { get; set; }
          public string Message { get; set; }


          private string GetDefaultMessageForStatusCode(int statusCode)
          {
               return statusCode switch
               {
                    400 => "You've made a bad request",
                    401 => "You're not Authorized",
                    403 => "You're forbidden from doing this",
                    404 => "Resource not found",
                    500 => "Server Error",
                    _ => null
               };
          }
     }
}