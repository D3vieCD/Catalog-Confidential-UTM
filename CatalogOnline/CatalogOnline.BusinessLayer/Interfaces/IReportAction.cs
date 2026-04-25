using CatalogOnline.Domain.Models.Report;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IReportAction
     {
          ReportActionResponse GenerateReportAction(GenerateReportDto generateData, int userId);
          ReportActionResponse GetReportHistoryAction(int userId);
          ReportActionResponse GetReportStatsAction(int userId);
          ReportActionResponse DownloadReportAction(int reportId, int userId);
          ReportActionResponse LogImportAction(LogImportDto logData, int userId);
     }
}
