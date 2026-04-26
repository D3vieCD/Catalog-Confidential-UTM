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

          public AuthActionResponse VerifyEmailAction(int userId, string code)
          {
               return VerifyEmailActionExecution(userId, code);
          }

          public AuthActionResponse ResendVerificationCodeAction(int userId)
          {
               return ResendVerificationCodeActionExecution(userId);
          }

          public AuthActionResponse ForgotPasswordAction(ForgotPasswordDto data, string frontendBaseUrl)
          {
               return ForgotPasswordActionExecution(data, frontendBaseUrl);
          }

          public AuthActionResponse ResetPasswordAction(ResetPasswordTokenDto data)
          {
               return ResetPasswordActionExecution(data);
          }
     }
}
