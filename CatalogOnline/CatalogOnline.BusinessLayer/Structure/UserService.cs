using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.User;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class UserService : UserActions, IUserAction
     {
          public DefaultActionResponse CreateUserAction(CreateUserDto createData)
          {
               return CreateUserActionExecution(createData);
          }
          public DefaultActionResponse DeleteUserAction(int id)
          {
              return DeleteUserActionExecution(id);
          }
          public DefaultActionResponse UpdateUserAction(int userId ,UpdateUserDto userData)
          {
              return UpdateUserActionExecution(userId, userData);
          }
          public DefaultActionResponse GetAllUsersAction()
          {
               return GetAllUsersActionExecution();
          }
          public DefaultActionResponse GetUserByIdAction(int id)
          {
               return GetUserByIdActionExecution(id);
          }
     }
    
}