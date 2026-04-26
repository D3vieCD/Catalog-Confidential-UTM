using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class DashboardService : DashboardActions, IDashboardAction
     {
          public DashboardActionResponse GetDashboardStatsAction(int userId)
          {
               return GetDashboardStatsActionExecution(userId);
          }

          public DashboardActionResponse GetRecentActivityAction(int userId)
          {
               return GetRecentActivityActionExecution(userId);
          }
     }
}
