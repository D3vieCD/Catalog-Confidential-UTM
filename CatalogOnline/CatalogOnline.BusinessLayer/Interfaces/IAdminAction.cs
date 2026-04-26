using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IAdminAction
     {
          AdminActionResponse GetAdminStatsAction();
          AdminActionResponse GetAdminActivityAction();
     }
}
