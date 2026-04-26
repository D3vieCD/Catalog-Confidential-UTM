using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.User;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IUserAction
     {
          UserActionResponse GetAllUsersAction();
          UserActionResponse GetUserByIdAction(int id);
          UserActionResponse CreateUserAction(CreateUserDto createData);
          UserActionResponse UpdateUserAction(int userId, UpdateUserDto userData);
          UserActionResponse DeleteUserAction(int id);
          UserActionResponse UpdateUserRoleAction(int userId, UpdateUserRoleDto roleData);
     }
}