namespace CatalogOnline.Domain.Models.Report
{
     public class ReportHistoryItemDto
     {
          public int Id { get; set; }
          public string GroupName { get; set; } = string.Empty;
          public string? StudentName { get; set; }
          public string ReportType { get; set; } = string.Empty;
          public string Format { get; set; } = string.Empty;
          public string FileName { get; set; } = string.Empty;
          public DateTime GeneratedAt { get; set; }
     }
}
