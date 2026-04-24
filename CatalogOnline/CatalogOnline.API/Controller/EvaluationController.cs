using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Evaluation;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/evaluation")]
     [ApiController]
     public class EvaluationController : ControllerBase
     {
          private readonly IEvaluationAction _evaluationAction;

          public EvaluationController()
          {
               var bl = new BusinessLogic();
               _evaluationAction = bl.EvaluationAction();
          }

          [HttpPost]
          public IActionResult CreateEvaluation(CreateEvaluationDto createData)
          {
               var response = _evaluationAction.CreateEvaluationAction(createData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet]
          public IActionResult GetAllEvaluations()
          {
               var response = _evaluationAction.GetAllEvaluationsAction();
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("{evaluationId}")]
          public IActionResult GetEvaluationById([FromRoute] int evaluationId)
          {
               var response = _evaluationAction.GetEvaluationByIdAction(evaluationId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("subject/{subjectId}")]
          public IActionResult GetEvaluationsBySubjectId([FromRoute] int subjectId)
          {
               var response = _evaluationAction.GetEvaluationsBySubjectIdAction(subjectId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpPut("{evaluationId}")]
          public IActionResult UpdateEvaluation([FromRoute] int evaluationId, UpdateEvaluationDto updateData)
          {
               var response = _evaluationAction.UpdateEvaluationAction(evaluationId, updateData);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpDelete("{evaluationId}")]
          public IActionResult DeleteEvaluation([FromRoute] int evaluationId)
          {
               var response = _evaluationAction.DeleteEvaluationAction(evaluationId);
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
