using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.User;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IUserAction
     {
          DefaultActionResponse GetAllUsersAction();
          DefaultActionResponse GetUserByIdAction(int id);
          DefaultActionResponse CreateUserAction(CreateUserDto createData);
          DefaultActionResponse UpdateUserAction(int userId, UpdateUserDto userData);
          DefaultActionResponse DeleteUserAction(int id);
     }
}