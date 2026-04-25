using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Report;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace CatalogOnline.API.Controller
{
     [Route("api/report")]
     [ApiController]
     [Authorize]
     public class ReportController : ControllerBase
     {
          private readonly IReportAction _reportAction;

          public ReportController()
          {
               var bl = new BusinessLogic();
               _reportAction = bl.ReportAction();
          }

          private int GetUserId()
          {
               var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
               return int.TryParse(claim, out var id) ? id : 0;
          }

          [HttpPost("generate")]
          public IActionResult GenerateReport(GenerateReportDto generateData)
          {
               var response = _reportAction.GenerateReportAction(generateData, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return File(response.FileData!, response.ContentType!, response.FileName);
          }

          [HttpGet]
          public IActionResult GetReportHistory()
          {
               var response = _reportAction.GetReportHistoryAction(GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("stats")]
          public IActionResult GetReportStats()
          {
               var response = _reportAction.GetReportStatsAction(GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }

          [HttpGet("{reportId}/download")]
          public IActionResult DownloadReport([FromRoute] int reportId)
          {
               var response = _reportAction.DownloadReportAction(reportId, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return File(response.FileData!, response.ContentType!, response.FileName);
          }

          [HttpPost("log-import")]
          public IActionResult LogImport(LogImportDto logData)
          {
               var response = _reportAction.LogImportAction(logData, GetUserId());
               if (!response.IsValid) return BadRequest(response.Message);
               return Ok(response);
          }
     }
}
