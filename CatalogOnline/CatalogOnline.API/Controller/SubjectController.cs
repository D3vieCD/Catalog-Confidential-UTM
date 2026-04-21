using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Subject;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/subject")]
     [ApiController]
     public class SubjectController : ControllerBase
     {
          private readonly ISubjectAction _subjectAction;
          public SubjectController()
          {
               var bl = new BusinessLogic();
               _subjectAction = bl.SubjectAction();
          }

          [HttpPost]
          public IActionResult CreateSubject(CreateSubjectDto createData)
          {
               var response = _subjectAction.CreateSubjectAction(createData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("group/{groupId}")]
          public IActionResult GetSubjectsByGroupId([FromRoute] int groupId)
          {
               var response = _subjectAction.GetSubjectsByGroupIdAction(groupId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpDelete("{subjectId}")]
          public IActionResult DeleteSubject([FromRoute] int subjectId)
          {
               var response = _subjectAction.DeleteSubjectAction(subjectId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
