using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Absence;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/absence")]
     [ApiController]
     public class AbsenceController : ControllerBase
     {
          private readonly IAbsenceAction _absenceAction;
          public AbsenceController()
          {
               var bl = new BusinessLogic();
               _absenceAction = bl.AbsenceAction();
          }

          [HttpPost]
          public IActionResult CreateAbsence(CreateAbsenceDto createData)
          {
               var response = _absenceAction.CreateAbsenceAction(createData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet]
          public IActionResult GetAllAbsences()
          {
               var response = _absenceAction.GetAllAbsencesAction();
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("{absenceId}")]
          public IActionResult GetAbsenceById([FromRoute] int absenceId)
          {
               var response = _absenceAction.GetAbsenceByIdAction(absenceId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("student/{studentId}")]
          public IActionResult GetAbsencesByStudentId([FromRoute] int studentId)
          {
               var response = _absenceAction.GetAbsencesByStudentIdAction(studentId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpPut("{absenceId}")]
          public IActionResult UpdateAbsence([FromRoute] int absenceId, UpdateAbsenceDto updateData)
          {
               var response = _absenceAction.UpdateAbsenceAction(absenceId, updateData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpDelete("{absenceId}")]
          public IActionResult DeleteAbsence([FromRoute] int absenceId)
          {
               var response = _absenceAction.DeleteAbsenceAction(absenceId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
