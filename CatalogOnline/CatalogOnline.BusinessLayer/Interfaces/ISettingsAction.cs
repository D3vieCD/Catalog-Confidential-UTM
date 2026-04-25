using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Settings;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface ISettingsAction
     {
          SettingsActionResponse GetProfileAction(int userId);
          SettingsActionResponse UpdateProfileAction(UpdateProfileDto updateData, int userId);
          SettingsActionResponse ChangePasswordAction(ChangePasswordDto changeData, int userId);
     }
}
