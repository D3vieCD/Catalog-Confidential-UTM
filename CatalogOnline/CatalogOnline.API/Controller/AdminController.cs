using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/admin")]
     [ApiController]
     [Authorize(Roles = "admin")]
     public class AdminController : ControllerBase
     {
          private readonly IAdminAction _adminAction;

          public AdminController()
          {
               var bl = new BusinessLogic();
               _adminAction = bl.AdminAction();
          }

          [HttpGet("stats")]
          public IActionResult GetAdminStats()
          {
               var response = _adminAction.GetAdminStatsAction();
               if (!response.IsValid)
                    return BadRequest(response.Message);
               return Ok(response.Stats);
          }

          [HttpGet("activity")]
          public IActionResult GetAdminActivity([FromQuery] int? userId = null)
          {
               var response = _adminAction.GetAdminActivityAction(userId);
               if (!response.IsValid)
                    return BadRequest(response.Message);
               return Ok(response.Activities);
          }

          [HttpGet("groups")]
          public IActionResult GetAdminGroups()
          {
               var response = _adminAction.GetAdminGroupsAction();
               if (!response.IsValid)
                    return BadRequest(response.Message);
               return Ok(response.Groups);
          }

          [HttpGet("students")]
          public IActionResult GetAdminStudents()
          {
               var response = _adminAction.GetAdminStudentsAction();
               if (!response.IsValid)
                    return BadRequest(response.Message);
               return Ok(response.Students);
          }

          [HttpDelete("users/{userId}/data")]
          public IActionResult ResetUserData(int userId)
          {
               var response = _adminAction.ResetUserDataAction(userId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response.Message);
          }

          [HttpPut("users/{userId}/password")]
          public IActionResult ResetUserPassword(int userId, [FromBody] ResetPasswordDto data)
          {
               var response = _adminAction.ResetUserPasswordAction(userId, data.NewPassword);
               if (!response.IsValid) return BadRequest(new { message = response.Message });
               return Ok(new { message = response.Message });
          }

          [HttpPut("groups/{id}/archive")]
          public IActionResult ArchiveAdminGroup(int id)
          {
               var response = _adminAction.ArchiveAdminGroupAction(id);
               if (!response.IsValid)
                    return NotFound(response.Message);
               return Ok(response.Message);
          }
     }
}
