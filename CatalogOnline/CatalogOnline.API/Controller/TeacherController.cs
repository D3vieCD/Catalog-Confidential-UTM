using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Teacher;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/teacher")]
     [ApiController]
     public class TeacherController : ControllerBase
     {
          private readonly ITeacherAction _teacherAction;
          public TeacherController()
          {
               var bl = new BusinessLogic();
               _teacherAction = bl.TeacherAction();
          }

          [HttpPost]
          public IActionResult CreateTeacher(CreateTeacherDto createData)
          {
               var response = _teacherAction.CreateUserAction(createData);
               if (response.IsValid)
               {
                    return Ok(response);
               }
               else
               {
                    return BadRequest(response);
               }
          }

     }
}
