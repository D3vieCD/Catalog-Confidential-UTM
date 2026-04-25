namespace CatalogOnline.Domain.Models.Report
{
     public class ReportStatsDto
     {
          public int TotalReports { get; set; }
          public int ActiveGroups { get; set; }
          public int ExportsThisMonth { get; set; }
          public int ImportsThisMonth { get; set; }
     }
}
