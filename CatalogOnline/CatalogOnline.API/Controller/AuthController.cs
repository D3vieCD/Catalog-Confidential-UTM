using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

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

          private int GetUserId() =>
               int.Parse(User.FindFirst(JwtRegisteredClaimNames.Sub)!.Value);

          [Authorize]
          [HttpGet("me")]
          public IActionResult GetProfile()
          {
               var response = _authAction.GetProfileAction(GetUserId());
               if (!response.IsValid) return NotFound(new { message = response.Message });
               return Ok(new
               {
                    id = response.UserId,
                    userName = response.UserName,
                    email = response.Email,
                    role = response.Role,
                    firstName = response.FirstName,
                    lastName = response.LastName,
                    phone = response.Phone,
                    bio = response.Bio
               });
          }

          [Authorize]
          [HttpPut("profile")]
          public IActionResult UpdateProfile([FromBody] AuthUpdateProfileDto data)
          {
               var response = _authAction.UpdateProfileAction(GetUserId(), data);
               if (!response.IsValid) return BadRequest(new { message = response.Message });
               return Ok(new { message = response.Message });
          }

          [Authorize]
          [HttpPut("change-password")]
          public IActionResult ChangePassword([FromBody] AuthChangePasswordDto data)
          {
               var response = _authAction.ChangePasswordAction(GetUserId(), data);
               if (!response.IsValid) return BadRequest(new { message = response.Message });
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
