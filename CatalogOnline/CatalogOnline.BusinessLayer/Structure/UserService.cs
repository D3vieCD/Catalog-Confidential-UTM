using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.User;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class UserService : UserActions, IUserAction
     {
          public UserActionResponse CreateUserAction(CreateUserDto createData)
          {
               return CreateUserActionExecution(createData);
          }
          public UserActionResponse DeleteUserAction(int id)
          {
              return DeleteUserActionExecution(id);
          }
          public UserActionResponse UpdateUserAction(int userId ,UpdateUserDto userData)
          {
              return UpdateUserActionExecution(userId, userData);
          }
          public UserActionResponse GetAllUsersAction()
          {
               return GetAllUsersActionExecution();
          }
          public UserActionResponse GetUserByIdAction(int id)
          {
               return GetUserByIdActionExecution(id);
          }
          public UserActionResponse UpdateUserRoleAction(int userId, UpdateUserRoleDto roleData)
          {
               return UpdateUserRoleActionExecution(userId, roleData);
          }
     }
}