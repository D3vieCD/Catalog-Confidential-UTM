using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IDashboardAction
     {
          DashboardActionResponse GetDashboardStatsAction(int userId);
          DashboardActionResponse GetRecentActivityAction(int userId);
     }
}
