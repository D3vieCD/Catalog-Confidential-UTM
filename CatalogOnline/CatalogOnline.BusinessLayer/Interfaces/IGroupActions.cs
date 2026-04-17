using CatalogOnline.Domain.Models.Group;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IGroupAction
     {
          DefaultActionResponse GetAllGroupsAction();
          DefaultActionResponse GetGroupByIdAction(int id);
          DefaultActionResponse CreateGroupAction(CreateGroupDto createData);
          DefaultActionResponse UpdateGroupAction(int groupId, UpdateGroupDto groupData);
          DefaultActionResponse DeleteGroupAction(int id);
     }
}