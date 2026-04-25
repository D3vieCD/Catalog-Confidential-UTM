using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Group;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class GroupService : GroupActions, IGroupAction
     {
          public GroupActionResponse CreateGroupAction(CreateGroupDto createData, int userId)
          {
               return CreateGroupActionExecution(createData, userId);
          }
          public GroupActionResponse DeleteGroupAction(int id, int userId)
          {
               return DeleteGroupActionExecution(id, userId);
          }
          public GroupActionResponse UpdateGroupAction(int groupId, UpdateGroupDto groupData, int userId)
          {
               return UpdateGroupActionExecution(groupId, groupData, userId);
          }
          public GroupActionResponse GetAllGroupsAction(int userId)
          {
               return GetAllGroupsActionExecution(userId);
          }
          public GroupActionResponse GetGroupByIdAction(int id, int userId)
          {
               return GetGroupByIdActionExecution(id, userId);
          }
     }
}
