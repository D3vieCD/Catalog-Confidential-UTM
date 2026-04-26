using CatalogOnline.Domain.Models.Auth;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IAuthAction
     {
          AuthActionResponse RegisterAction(RegisterDto registerData);
          AuthActionResponse LoginAction(LoginDto loginData);
          AuthActionResponse RegisterAdminAction(RegisterAdminDto registerData, string validKey);
          AuthActionResponse GetProfileAction(int userId);
          AuthActionResponse UpdateProfileAction(int userId, AuthUpdateProfileDto data);
          AuthActionResponse ChangePasswordAction(int userId, AuthChangePasswordDto data);
     }
}
