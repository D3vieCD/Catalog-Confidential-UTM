using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IAdminAction
     {
          AdminActionResponse GetAdminStatsAction();
          AdminActionResponse GetAdminActivityAction(int? userId = null);
          AdminActionResponse GetAdminGroupsAction();
          AdminActionResponse ArchiveAdminGroupAction(int groupId);
          AdminActionResponse GetAdminStudentsAction();
          AdminActionResponse ResetUserDataAction(int targetUserId);
     }
}
