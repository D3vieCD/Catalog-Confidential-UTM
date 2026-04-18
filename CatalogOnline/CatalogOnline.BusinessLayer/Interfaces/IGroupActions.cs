using CatalogOnline.Domain.Models.Group;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IGroupAction
     {
          GroupActionResponse GetAllGroupsAction();
          GroupActionResponse GetGroupByIdAction(int id);
          GroupActionResponse CreateGroupAction(CreateGroupDto createData);
          GroupActionResponse UpdateGroupAction(int groupId, UpdateGroupDto groupData);
          GroupActionResponse DeleteGroupAction(int id);
     }
}