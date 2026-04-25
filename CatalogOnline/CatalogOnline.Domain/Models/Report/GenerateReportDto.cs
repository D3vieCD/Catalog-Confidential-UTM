namespace CatalogOnline.Domain.Models.Report
{
     public class GenerateReportDto
     {
          public int GroupId { get; set; }
          public int? StudentId { get; set; }
          public string ReportType { get; set; } = string.Empty;
          public string Format { get; set; } = "XLSX";
     }
}
