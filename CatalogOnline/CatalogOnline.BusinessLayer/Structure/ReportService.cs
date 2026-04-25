using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Report;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class ReportService : ReportActions, IReportAction
     {
          public ReportActionResponse GenerateReportAction(GenerateReportDto generateData, int userId)
          {
               return GenerateReportActionExecution(generateData, userId);
          }
          public ReportActionResponse GetReportHistoryAction(int userId)
          {
               return GetReportHistoryActionExecution(userId);
          }
          public ReportActionResponse GetReportStatsAction(int userId)
          {
               return GetReportStatsActionExecution(userId);
          }
          public ReportActionResponse DownloadReportAction(int reportId, int userId)
          {
               return DownloadReportActionExecution(reportId, userId);
          }
          public ReportActionResponse LogImportAction(LogImportDto logData, int userId)
          {
               return LogImportActionExecution(logData, userId);
          }
     }
}
