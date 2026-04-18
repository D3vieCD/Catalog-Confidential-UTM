using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Group;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/group")]
     [ApiController]
     public class GroupController : ControllerBase
     {
          private readonly IGroupAction _groupAction;
          public GroupController()
          {
               var bl = new BusinessLogic();
               _groupAction = bl.GroupAction();
          }

          [HttpPost]
          public IActionResult CreateGroup(CreateGroupDto createData)
          {
               var response = _groupAction.CreateGroupAction(createData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet]
          public IActionResult GetAllGroups()
          {
               var response = _groupAction.GetAllGroupsAction();
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("{groupId}")]
          public IActionResult GetGroupById([FromRoute] int groupId)
          {
               var response = _groupAction.GetGroupByIdAction(groupId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpPut("{groupId}")]
          public IActionResult UpdateGroup([FromRoute] int groupId, UpdateGroupDto updateData)
          {
               var response = _groupAction.UpdateGroupAction(groupId, updateData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpDelete("{groupId}")]
          public IActionResult DeleteGroup([FromRoute] int groupId)
          {
               var response = _groupAction.DeleteGroupAction(groupId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}