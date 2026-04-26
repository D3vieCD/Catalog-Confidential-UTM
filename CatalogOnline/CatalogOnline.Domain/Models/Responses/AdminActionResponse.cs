using CatalogOnline.Domain.Models.Admin;

namespace CatalogOnline.Domain.Models.Responses
{
     public class AdminActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public AdminStatsDto? Stats { get; set; }
          public List<AdminActivityDto>? Activities { get; set; }
          public List<AdminGroupDto>? Groups { get; set; }
          public List<AdminStudentDto>? Students { get; set; }
     }
}
