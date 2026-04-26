using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
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
