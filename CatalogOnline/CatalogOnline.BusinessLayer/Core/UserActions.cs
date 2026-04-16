using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.User;

namespace CatalogOnline.BusinessLayer.Core
{
     public class UserActions
     {
          public DefaultActionResponse CreateUserActionExecution(CreateUserDto createData)
               
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = new UserData
                    {
                         UserName = createData.UserName,
                         Password = createData.Password,
                         Email = createData.Email,
                         FirstName = createData.FirstName,
                         LastName = createData.LastName,
                    };
                    appDbContext.User.Add(user);
                    appDbContext.SaveChanges();
                    return new DefaultActionResponse
                    {
                         IsValid = true,
                         Message = "User created successfully."
                    };

               }
          }

          public DefaultActionResponse DeleteUserActionExecution(int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = appDbContext.User.Find(userId);
                    if (user == null)
                    {
                         return new DefaultActionResponse
                         {
                              IsValid = false,
                              Message = "User not found."
                         };
                    }
                    appDbContext.User.Remove(user);
                    appDbContext.SaveChanges();
                    return new DefaultActionResponse
                    {
                         IsValid = true,
                         Message = "User deleted successfully."
                    };
               }

          }
          public DefaultActionResponse UpdateUserActionExecution(int userId, UpdateUserDto updateData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = appDbContext.User.Find(userId);
                    if (user == null)
                    {
                         return new DefaultActionResponse
                         {
                              IsValid = false,
                              Message = "User not found."
                         };
                    }
                    user.UserName = updateData.UserName;
                    user.Password = updateData.Password;
                    user.Email = updateData.Email;
                    user.FirstName = updateData.FirstName;
                    user.LastName = updateData.LastName;
                    appDbContext.SaveChanges();
                    return new DefaultActionResponse
                    {
                         IsValid = true,
                         Message = "User updated successfully."
                    };
               }
          }
          public DefaultActionResponse GetUserByIdActionExecution(int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = appDbContext.User.Find(userId);
                    return new DefaultActionResponse
                    {
                         IsValid = user != null,
                         Message = user != null ? "User retrieved successfully." : "User not found.",
                         User = user
                    };
               }
          }
          public DefaultActionResponse GetAllUsersActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var users = appDbContext.User.ToList();
                    return new DefaultActionResponse
                    {
                         IsValid = true,
                         Message = "Users retrieved successfully.",
                         Users = users
                    };
               }
          }

     }
}