using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace CatalogOnline.API.Controller
{
     [Route("api/dashboard")]
     [ApiController]
     [Authorize]
     public class DashboardController : ControllerBase
     {
          private readonly IDashboardAction _dashboardAction;

          public DashboardController()
          {
               var bl = new BusinessLogic();
               _dashboardAction = bl.DashboardAction();
          }

          private int GetUserId()
          {
               var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
               return int.TryParse(claim, out var id) ? id : 0;
          }

          [HttpGet("stats")]
          public IActionResult GetDashboardStats()
          {
               var response = _dashboardAction.GetDashboardStatsAction(GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("recent-activity")]
          public IActionResult GetRecentActivity()
          {
               var response = _dashboardAction.GetRecentActivityAction(GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
