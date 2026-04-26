using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Auth;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class AuthService : AuthActions, IAuthAction
     {
          public AuthActionResponse RegisterAction(RegisterDto registerData)
          {
               return RegisterActionExecution(registerData);
          }

          public AuthActionResponse LoginAction(LoginDto loginData)
          {
               return LoginActionExecution(loginData);
          }

          public AuthActionResponse RegisterAdminAction(RegisterAdminDto registerData, string validKey)
          {
               return RegisterAdminActionExecution(registerData, validKey);
          }

          public AuthActionResponse GetProfileAction(int userId)
          {
               return GetProfileActionExecution(userId);
          }

          public AuthActionResponse UpdateProfileAction(int userId, AuthUpdateProfileDto data)
          {
               return UpdateProfileActionExecution(userId, data);
          }

          public AuthActionResponse ChangePasswordAction(int userId, AuthChangePasswordDto data)
          {
               return ChangePasswordActionExecution(userId, data);
          }
     }
}
