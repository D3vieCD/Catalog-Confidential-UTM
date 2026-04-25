using CatalogOnline.Domain.Models.Report;

namespace CatalogOnline.Domain.Models.Responses
{
     public class ReportActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public byte[]? FileData { get; set; }
          public string? FileName { get; set; }
          public string? ContentType { get; set; }
          public ReportHistoryItemDto? Report { get; set; }
          public List<ReportHistoryItemDto>? Reports { get; set; }
          public ReportStatsDto? Stats { get; set; }
     }
}
