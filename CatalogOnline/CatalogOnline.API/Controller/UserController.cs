using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/user")]
     [ApiController]
     [Authorize(Roles = "admin")]
     public class UserController : ControllerBase
     {
          private readonly IUserAction _userAction;
          public UserController()
          {
               var bl = new BusinessLogic();
               _userAction = bl.UserAction();
          }

          [HttpPost]
          public IActionResult CreateUser(CreateUserDto createData)
          {
               var response = _userAction.CreateUserAction(createData);
               if (!response.IsValid)
               {
                    return BadRequest(response.Message);
               }
               return Ok(response.Message);
          }
          [HttpGet]
          public IActionResult GetAllUsers()
          {
               var response = _userAction.GetAllUsersAction();
               if (!response.IsValid)
               {
                    return BadRequest(response.Message);
               }
               return Ok(response.Users);
          }
          [HttpDelete("{userId}")]
          public IActionResult DeleteUser([FromRoute] int userId)
          {
               var response = _userAction.DeleteUserAction(userId);
               if (!response.IsValid)
               {
                    return BadRequest(response.Message);

               }
               return Ok(response.Message);
          }
          [HttpPut("{userId}")]
          public IActionResult UpdateUser([FromRoute] int userId, UpdateUserDto updateData)
          {
               var response = _userAction.UpdateUserAction(userId, updateData);
               if (!response.IsValid)
               {
                    return BadRequest(response.Message);
               }
               return Ok(response.Message);
          }
          [HttpGet("{userId}")]
          public IActionResult GetUserById([FromRoute] int userId)
          {
               var response = _userAction.GetUserByIdAction(userId);
               if (!response.IsValid)
               {
                    return BadRequest(response.Message);
               }
               return Ok(response.User);
          }

          [HttpPut("{userId}/role")]
          public IActionResult UpdateUserRole([FromRoute] int userId, UpdateUserRoleDto roleData)
          {
               var response = _userAction.UpdateUserRoleAction(userId, roleData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response.Message);
          }
     }
}
