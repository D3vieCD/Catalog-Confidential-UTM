using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Grade;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/grade")]
     [ApiController]
     public class GradeController : ControllerBase
     {
          private readonly IGradeAction _gradeAction;
          public GradeController()
          {
               var bl = new BusinessLogic();
               _gradeAction = bl.GradeAction();
          }

          [HttpPost]
          public IActionResult CreateGrade(CreateGradeDto createData)
          {
               var response = _gradeAction.CreateGradeAction(createData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet]
          public IActionResult GetAllGrades()
          {
               var response = _gradeAction.GetAllGradesAction();
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("{gradeId}")]
          public IActionResult GetGradeById([FromRoute] int gradeId)
          {
               var response = _gradeAction.GetGradeByIdAction(gradeId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("student/{studentId}")]
          public IActionResult GetGradesByStudentId([FromRoute] int studentId)
          {
               var response = _gradeAction.GetGradesByStudentIdAction(studentId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpPut("{gradeId}")]
          public IActionResult UpdateGrade([FromRoute] int gradeId, UpdateGradeDto updateData)
          {
               var response = _gradeAction.UpdateGradeAction(gradeId, updateData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpDelete("{gradeId}")]
          public IActionResult DeleteGrade([FromRoute] int gradeId)
          {
               var response = _gradeAction.DeleteGradeAction(gradeId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
