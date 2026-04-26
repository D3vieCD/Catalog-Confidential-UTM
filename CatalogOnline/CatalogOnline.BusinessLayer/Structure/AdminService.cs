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

          public AdminActionResponse GetAdminActivityAction(int? userId = null)
          {
               return GetAdminActivityActionExecution(userId);
          }

          public AdminActionResponse GetAdminGroupsAction()
          {
               return GetAdminGroupsActionExecution();
          }

          public AdminActionResponse ArchiveAdminGroupAction(int groupId)
          {
               return ArchiveAdminGroupActionExecution(groupId);
          }

          public AdminActionResponse GetAdminStudentsAction()
          {
               return GetAdminStudentsActionExecution();
          }

          public AdminActionResponse ResetUserDataAction(int targetUserId)
          {
               return ResetUserDataActionExecution(targetUserId);
          }
     }
}
