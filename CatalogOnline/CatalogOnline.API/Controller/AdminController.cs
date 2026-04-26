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
          public IActionResult GetAdminActivity()
          {
               var response = _adminAction.GetAdminActivityAction();
               if (!response.IsValid)
                    return BadRequest(response.Message);
               return Ok(response.Activities);
          }
     }
}
