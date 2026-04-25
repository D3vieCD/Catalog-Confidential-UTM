using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Settings;

namespace CatalogOnline.BusinessLayer.Core
{
     public class SettingsActions
     {
          public SettingsActionResponse GetProfileActionExecution(int userId)
          {
               using var appDbContext = new AppDbContext();

               var user = appDbContext.User.FirstOrDefault(u => u.Id == userId);
               if (user == null)
                    return new SettingsActionResponse { IsValid = false, Message = "Utilizatorul nu a fost găsit." };

               return new SettingsActionResponse
               {
                    IsValid = true,
                    Message = "Profil recuperat cu succes.",
                    Profile = new SettingsProfileDto
                    {
                         UserName = user.UserName,
                         Email = user.Email,
                         Phone = user.Phone,
                         Bio = user.Bio,
                         Role = user.Role,
                         Avatar = user.Avatar
                    }
               };
          }

          public SettingsActionResponse UpdateProfileActionExecution(UpdateProfileDto updateData, int userId)
          {
               using var appDbContext = new AppDbContext();

               var user = appDbContext.User.FirstOrDefault(u => u.Id == userId);
               if (user == null)
                    return new SettingsActionResponse { IsValid = false, Message = "Utilizatorul nu a fost găsit." };

               if (string.IsNullOrWhiteSpace(updateData.UserName))
                    return new SettingsActionResponse { IsValid = false, Message = "Numele de utilizator este obligatoriu." };

               if (appDbContext.User.Any(u => u.UserName == updateData.UserName && u.Id != userId))
                    return new SettingsActionResponse { IsValid = false, Message = "Numele de utilizator este deja folosit." };

               user.UserName = updateData.UserName;
               user.Phone = updateData.Phone;
               user.Bio = updateData.Bio;
               if (updateData.Avatar != null)
                    user.Avatar = updateData.Avatar;
               appDbContext.SaveChanges();

               return new SettingsActionResponse { IsValid = true, Message = "Profil actualizat cu succes." };
          }

          public SettingsActionResponse ChangePasswordActionExecution(ChangePasswordDto changeData, int userId)
          {
               using var appDbContext = new AppDbContext();

               var user = appDbContext.User.FirstOrDefault(u => u.Id == userId);
               if (user == null)
                    return new SettingsActionResponse { IsValid = false, Message = "Utilizatorul nu a fost găsit." };

               if (!BCrypt.Net.BCrypt.Verify(changeData.CurrentPassword, user.Password))
                    return new SettingsActionResponse { IsValid = false, Message = "Parola curentă este incorectă." };

               if (changeData.NewPassword != changeData.ConfirmPassword)
                    return new SettingsActionResponse { IsValid = false, Message = "Parolele noi nu coincid." };

               if (changeData.NewPassword.Length < 6)
                    return new SettingsActionResponse { IsValid = false, Message = "Parola nouă trebuie să aibă cel puțin 6 caractere." };

               user.Password = BCrypt.Net.BCrypt.HashPassword(changeData.NewPassword);
               appDbContext.SaveChanges();

               return new SettingsActionResponse { IsValid = true, Message = "Parola a fost schimbată cu succes." };
          }
     }
}
