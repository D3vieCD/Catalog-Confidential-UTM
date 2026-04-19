using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Student;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/student")]
     [ApiController]
     public class StudentController : ControllerBase
     {
          private readonly IStudentAction _studentAction;
          public StudentController()
          {
               var bl = new BusinessLogic();
                    _studentAction = bl.StudentAction();
               }

               [HttpPost]
               public IActionResult CreateStudent(CreateStudentDto createData)
               {
                    var response = _studentAction.CreateStudentAction(createData);
                    if (!response.IsValid)
                    {
                         return BadRequest(response.Message);
                    }
                    return Ok(response);
               }
               [HttpGet]
               public IActionResult GetAllStudents()
               {
                    var response = _studentAction.GetAllStudentsAction();
                    if (!response.IsValid)
                    {
                         return BadRequest(response.Message);
                    }
                    return Ok(response);
               }
               [HttpDelete("{studentId}")]
               public IActionResult DeleteStudent([FromRoute] int studentId)
               {
                    var response = _studentAction.DeleteStudentAction(studentId );
                    if (!response.IsValid)
                    {
                         return BadRequest(response.Message);

                    }
                    return Ok(response);
               }
               [HttpPut("{studentId}")]
               public IActionResult UpdateStudent([FromRoute] int studentId, UpdateStudentDto updateData)
               {
                    var response = _studentAction.UpdateStudentAction(studentId, updateData);
                    if (!response.IsValid)
                    {
                         return BadRequest(response.Message);
                    }
                    return Ok(response);
               }
               [HttpGet("{studentId}")]
               public IActionResult GetStudentById([FromRoute] int studentId)
               {
                    var response = _studentAction.GetStudentByIdAction(studentId);
                    if (!response.IsValid)
                    {
                         return BadRequest(response.Message);
                    }
                    return Ok(response);
               }
          }
     }
