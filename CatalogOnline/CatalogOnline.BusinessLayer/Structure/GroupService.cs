using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Group;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class GroupService : GroupActions, IGroupAction
     {
          public GroupActionResponse CreateGroupAction(CreateGroupDto createData)
          {
               return CreateGroupActionExecution(createData);
          }
          public GroupActionResponse DeleteGroupAction(int id)
          {
               return DeleteGroupActionExecution(id);
          }
          public GroupActionResponse UpdateGroupAction(int groupId, UpdateGroupDto groupData)
          {
               return UpdateGroupActionExecution(groupId, groupData);
          }
          public GroupActionResponse GetAllGroupsAction()
          {
               return GetAllGroupsActionExecution();
          }
          public GroupActionResponse GetGroupByIdAction(int id)
          {
               return GetGroupByIdActionExecution(id);
          }
     }
}