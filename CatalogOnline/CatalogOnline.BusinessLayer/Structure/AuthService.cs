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
     }
}
