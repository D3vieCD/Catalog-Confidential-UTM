using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Settings;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class SettingsService : SettingsActions, ISettingsAction
     {
          public SettingsActionResponse GetProfileAction(int userId)
          {
               return GetProfileActionExecution(userId);
          }
          public SettingsActionResponse UpdateProfileAction(UpdateProfileDto updateData, int userId)
          {
               return UpdateProfileActionExecution(updateData, userId);
          }
          public SettingsActionResponse ChangePasswordAction(ChangePasswordDto changeData, int userId)
          {
               return ChangePasswordActionExecution(changeData, userId);
          }
     }
}
