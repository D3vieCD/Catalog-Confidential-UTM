using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Group;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class GroupService : GroupActions, IGroupAction
     {
          public DefaultActionResponse CreateGroupAction(CreateGroupDto createData)
          {
               return CreateGroupActionExecution(createData);
          }
          public DefaultActionResponse DeleteGroupAction(int id)
          {
               return DeleteGroupActionExecution(id);
          }
          public DefaultActionResponse UpdateGroupAction(int groupId, UpdateGroupDto groupData)
          {
               return UpdateGroupActionExecution(groupId, groupData);
          }
          public DefaultActionResponse GetAllGroupsAction()
          {
               return GetAllGroupsActionExecution();
          }
          public DefaultActionResponse GetGroupByIdAction(int id)
          {
               return GetGroupByIdActionExecution(id);
          }
     }
}