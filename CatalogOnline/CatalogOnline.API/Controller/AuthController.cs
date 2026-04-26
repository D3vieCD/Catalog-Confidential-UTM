using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Auth;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/auth")]
     [ApiController]
     public class AuthController : ControllerBase
     {
          private readonly IAuthAction _authAction;
          private readonly string _adminSecretKey;

          public AuthController(IConfiguration configuration)
          {
               var bl = new BusinessLogic();
               _authAction = bl.AuthAction();
               _adminSecretKey = configuration["AdminSecretKey"] ?? string.Empty;
          }

          [HttpPost("register")]
          public IActionResult Register(RegisterDto registerData)
          {
               var response = _authAction.RegisterAction(registerData);
               if (!response.IsValid)
                    return BadRequest(new { message = response.Message });
               return Ok(new { message = response.Message });
          }

          [HttpPost("register-admin")]
          public IActionResult RegisterAdmin([FromBody] RegisterAdminDto registerData)
          {
               var response = _authAction.RegisterAdminAction(registerData, _adminSecretKey);
               if (!response.IsValid)
                    return BadRequest(new { message = response.Message });
               return Ok(new { message = response.Message });
          }

          [HttpPost("login")]
          public IActionResult Login(LoginDto loginData)
          {
               var response = _authAction.LoginAction(loginData);
               if (!response.IsValid)
                    return Unauthorized(new { message = response.Message });
               return Ok(new
               {
                    token = response.Token,
                    userId = response.UserId,
                    userName = response.UserName,
                    email = response.Email,
                    role = response.Role
               });
          }
     }
}
