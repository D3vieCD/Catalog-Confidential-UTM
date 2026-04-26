using CatalogOnline.Domain.Models.Dashboard;

namespace CatalogOnline.Domain.Models.Responses
{
     public class DashboardActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; }
          public DashboardStatsDto Stats { get; set; }
          public List<RecentActivityDto> RecentActivities { get; set; }
     }
}
