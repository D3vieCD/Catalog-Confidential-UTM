using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Student;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace CatalogOnline.API.Controller
{
     [Route("api/student")]
     [ApiController]
     [Authorize]
     public class StudentController : ControllerBase
     {
          private readonly IStudentAction _studentAction;
          public StudentController()
          {
               var bl = new BusinessLogic();
               _studentAction = bl.StudentAction();
          }

          private int GetUserId()
          {
               var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
               return int.TryParse(claim, out var id) ? id : 0;
          }

          [HttpPost]
          public IActionResult CreateStudent(CreateStudentDto createData)
          {
               var response = _studentAction.CreateStudentAction(createData, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet]
          public IActionResult GetAllStudents()
          {
               var response = _studentAction.GetAllStudentsAction(GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpDelete("{studentId}")]
          public IActionResult DeleteStudent([FromRoute] int studentId)
          {
               var response = _studentAction.DeleteStudentAction(studentId, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpPut("{studentId}")]
          public IActionResult UpdateStudent([FromRoute] int studentId, UpdateStudentDto updateData)
          {
               var response = _studentAction.UpdateStudentAction(studentId, updateData, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("{studentId}")]
          public IActionResult GetStudentById([FromRoute] int studentId)
          {
               var response = _studentAction.GetStudentByIdAction(studentId, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
