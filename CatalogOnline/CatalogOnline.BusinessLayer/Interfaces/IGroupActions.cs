using CatalogOnline.Domain.Models.Group;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IGroupAction
     {
          GroupActionResponse GetAllGroupsAction(int userId);
          GroupActionResponse GetGroupByIdAction(int id, int userId);
          GroupActionResponse CreateGroupAction(CreateGroupDto createData, int userId);
          GroupActionResponse UpdateGroupAction(int groupId, UpdateGroupDto groupData, int userId);
          GroupActionResponse DeleteGroupAction(int id, int userId);
     }
}
