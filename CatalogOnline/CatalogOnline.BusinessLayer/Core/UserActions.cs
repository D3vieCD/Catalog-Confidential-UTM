using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.User;

namespace CatalogOnline.BusinessLayer.Core
{
     public class UserActions
     {
          public UserActionResponse CreateUserActionExecution(CreateUserDto createData)
               
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = new UserData
                    {
                         UserName = createData.UserName,
                         Password = BCrypt.Net.BCrypt.HashPassword(createData.Password),
                         Email = createData.Email,
                         FirstName = createData.FirstName,
                         LastName = createData.LastName,
                    };
                    appDbContext.User.Add(user);
                    appDbContext.SaveChanges();
                    return new UserActionResponse
                    {
                         IsValid = true,
                         Message = "User created successfully."
                    };

               }
          }

          public UserActionResponse DeleteUserActionExecution(int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = appDbContext.User.Find(userId);
                    if (user == null)
                    {
                         return new UserActionResponse
                         {
                              IsValid = false,
                              Message = "User not found."
                         };
                    }
                    appDbContext.User.Remove(user);
                    appDbContext.SaveChanges();
                    return new UserActionResponse
                    {
                         IsValid = true,
                         Message = "User deleted successfully."
                    };
               }

          }
          public UserActionResponse UpdateUserActionExecution(int userId, UpdateUserDto updateData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = appDbContext.User.Find(userId);
                    if (user == null)
                    {
                         return new UserActionResponse
                         {
                              IsValid = false,
                              Message = "User not found."
                         };
                    }
                    user.UserName = updateData.UserName;
                    user.Password = BCrypt.Net.BCrypt.HashPassword(updateData.Password);
                    user.Email = updateData.Email;
                    user.FirstName = updateData.FirstName;
                    user.LastName = updateData.LastName;
                    appDbContext.SaveChanges();
                    return new UserActionResponse
                    {
                         IsValid = true,
                         Message = "User updated successfully."
                    };
               }
          }
          public UserActionResponse GetUserByIdActionExecution(int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = appDbContext.User.Find(userId);
                    return new UserActionResponse
                    {
                         IsValid = user != null,
                         Message = user != null ? "User retrieved successfully." : "User not found.",
                         User = user
                    };
               }
          }
          public UserActionResponse GetAllUsersActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var users = appDbContext.User.ToList();
                    return new UserActionResponse
                    {
                         IsValid = true,
                         Message = "Users retrieved successfully.",
                         Users = users
                    };
               }
          }

          public UserActionResponse UpdateUserRoleActionExecution(int userId, UpdateUserRoleDto roleData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var user = appDbContext.User.Find(userId);
                    if (user == null)
                         return new UserActionResponse { IsValid = false, Message = "Utilizatorul nu a fost găsit." };

                    if (string.IsNullOrWhiteSpace(roleData.Role))
                         return new UserActionResponse { IsValid = false, Message = "Rolul este necesar." };

                    user.Role = roleData.Role;
                    appDbContext.SaveChanges();
                    return new UserActionResponse { IsValid = true, Message = "Rol actualizat cu succes." };
               }
          }
     }
}