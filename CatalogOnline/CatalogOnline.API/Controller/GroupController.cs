using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Group;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace CatalogOnline.API.Controller
{
     [Route("api/group")]
     [ApiController]
     [Authorize]
     public class GroupController : ControllerBase
     {
          private readonly IGroupAction _groupAction;
          public GroupController()
          {
               var bl = new BusinessLogic();
               _groupAction = bl.GroupAction();
          }

          private int GetUserId()
          {
               var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
               return int.TryParse(claim, out var id) ? id : 0;
          }

          [HttpPost]
          public IActionResult CreateGroup(CreateGroupDto createData)
          {
               var response = _groupAction.CreateGroupAction(createData, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet]
          public IActionResult GetAllGroups()
          {
               var response = _groupAction.GetAllGroupsAction(GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("{groupId}")]
          public IActionResult GetGroupById([FromRoute] int groupId)
          {
               var response = _groupAction.GetGroupByIdAction(groupId, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpPut("{groupId}")]
          public IActionResult UpdateGroup([FromRoute] int groupId, UpdateGroupDto updateData)
          {
               var response = _groupAction.UpdateGroupAction(groupId, updateData, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpDelete("{groupId}")]
          public IActionResult DeleteGroup([FromRoute] int groupId)
          {
               var response = _groupAction.DeleteGroupAction(groupId, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
