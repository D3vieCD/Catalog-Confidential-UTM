using CatalogOnline.Domain.Models.Auth;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IAuthAction
     {
          AuthActionResponse RegisterAction(RegisterDto registerData);
          AuthActionResponse LoginAction(LoginDto loginData);
     }
}
