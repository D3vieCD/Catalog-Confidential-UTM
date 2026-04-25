using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace CatalogOnline.API.Controller
{
     [Route("api/settings")]
     [ApiController]
     [Authorize]
     public class SettingsController : ControllerBase
     {
          private readonly ISettingsAction _settingsAction;

          public SettingsController()
          {
               var bl = new BusinessLogic();
               _settingsAction = bl.SettingsAction();
          }

          private int GetUserId()
          {
               var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
               return int.TryParse(claim, out var id) ? id : 0;
          }

          [HttpGet("profile")]
          public IActionResult GetProfile()
          {
               var response = _settingsAction.GetProfileAction(GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpPut("profile")]
          public IActionResult UpdateProfile(UpdateProfileDto updateData)
          {
               var response = _settingsAction.UpdateProfileAction(updateData, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpPut("password")]
          public IActionResult ChangePassword(ChangePasswordDto changeData)
          {
               var response = _settingsAction.ChangePasswordAction(changeData, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
