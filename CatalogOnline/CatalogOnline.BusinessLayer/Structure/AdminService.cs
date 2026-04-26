using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class AdminService : AdminActions, IAdminAction
     {
          public AdminActionResponse GetAdminStatsAction()
          {
               return GetAdminStatsActionExecution();
          }

          public AdminActionResponse GetAdminActivityAction()
          {
               return GetAdminActivityActionExecution();
          }
     }
}
