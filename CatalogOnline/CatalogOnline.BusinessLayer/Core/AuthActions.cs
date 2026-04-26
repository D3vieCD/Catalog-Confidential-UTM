using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.BusinessLayer.Structure;
using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.User;
using CatalogOnline.Domain.Models.Auth;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Core
{
     public class AuthActions
     {
          private readonly IJwtAction _jwtAction;

          public AuthActions()
          {
               _jwtAction = new JwtService();
          }

          public AuthActionResponse RegisterActionExecution(RegisterDto registerData)
          {
               if (registerData == null)
                    return new AuthActionResponse { IsValid = false, Message = "Datele de înregistrare sunt necesare." };

               if (string.IsNullOrWhiteSpace(registerData.UserName))
                    return new AuthActionResponse { IsValid = false, Message = "Username-ul este necesar." };

               if (string.IsNullOrWhiteSpace(registerData.Email))
                    return new AuthActionResponse { IsValid = false, Message = "Email-ul este necesar." };

               if (string.IsNullOrWhiteSpace(registerData.Password))
                    return new AuthActionResponse { IsValid = false, Message = "Parola este necesară." };

               if (string.IsNullOrWhiteSpace(registerData.ConfirmPassword))
                    return new AuthActionResponse { IsValid = false, Message = "Confirmarea parolei este necesară." };

               if (registerData.Password != registerData.ConfirmPassword)
                    return new AuthActionResponse { IsValid = false, Message = "Parolele nu coincid." };

               using var appDbContext = new AppDbContext();

               if (appDbContext.User.Any(u => u.UserName == registerData.UserName))
                    return new AuthActionResponse { IsValid = false, Message = "Username-ul este deja folosit." };

               if (appDbContext.User.Any(u => u.Email == registerData.Email))
                    return new AuthActionResponse { IsValid = false, Message = "Email-ul este deja folosit." };

               var user = new UserData
               {
                    UserName = registerData.UserName,
                    FirstName = registerData.FirstName,
                    LastName = registerData.LastName,
                    Email = registerData.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(registerData.Password),
                    Role = "User"
               };

               appDbContext.User.Add(user);
               appDbContext.SaveChanges();

               return new AuthActionResponse { IsValid = true, Message = "Înregistrare reușită." };
          }

          public AuthActionResponse LoginActionExecution(LoginDto loginData)
          {
               if (loginData == null)
                    return new AuthActionResponse { IsValid = false, Message = "Datele de autentificare sunt necesare." };

               if (string.IsNullOrWhiteSpace(loginData.Credential))
                    return new AuthActionResponse { IsValid = false, Message = "Username sau email este necesar." };

               if (string.IsNullOrWhiteSpace(loginData.Password))
                    return new AuthActionResponse { IsValid = false, Message = "Parola este necesară." };

               using var appDbContext = new AppDbContext();

               var user = appDbContext.User.FirstOrDefault(u =>
                    u.UserName == loginData.Credential || u.Email == loginData.Credential);

               if (user == null || !BCrypt.Net.BCrypt.Verify(loginData.Password, user.Password))
                    return new AuthActionResponse { IsValid = false, Message = "Credențiale invalide." };

               var jwtResponse = _jwtAction.GenerateTokenAction(user.Id, user.UserName, user.Role);

               return new AuthActionResponse
               {
                    IsValid = true,
                    Message = "Autentificare reușită.",
                    Token = jwtResponse.Token,
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = user.Role
               };
          }

          public AuthActionResponse RegisterAdminActionExecution(RegisterAdminDto registerData, string validKey)
          {
               if (registerData == null)
                    return new AuthActionResponse { IsValid = false, Message = "Datele de înregistrare sunt necesare." };

               if (registerData.SecretKey != validKey)
                    return new AuthActionResponse { IsValid = false, Message = "Cheie secretă invalidă." };

               if (string.IsNullOrWhiteSpace(registerData.UserName))
                    return new AuthActionResponse { IsValid = false, Message = "Username-ul este necesar." };

               if (string.IsNullOrWhiteSpace(registerData.Email))
                    return new AuthActionResponse { IsValid = false, Message = "Email-ul este necesar." };

               if (string.IsNullOrWhiteSpace(registerData.Password))
                    return new AuthActionResponse { IsValid = false, Message = "Parola este necesară." };

               if (registerData.Password != registerData.ConfirmPassword)
                    return new AuthActionResponse { IsValid = false, Message = "Parolele nu coincid." };

               using var appDbContext = new AppDbContext();

               if (appDbContext.User.Any(u => u.UserName == registerData.UserName))
                    return new AuthActionResponse { IsValid = false, Message = "Username-ul este deja folosit." };

               if (appDbContext.User.Any(u => u.Email == registerData.Email))
                    return new AuthActionResponse { IsValid = false, Message = "Email-ul este deja folosit." };

               var user = new UserData
               {
                    UserName = registerData.UserName,
                    FirstName = registerData.FirstName,
                    LastName = registerData.LastName,
                    Email = registerData.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(registerData.Password),
                    Role = "admin"
               };

               appDbContext.User.Add(user);
               appDbContext.SaveChanges();

               return new AuthActionResponse { IsValid = true, Message = "Cont de administrator creat cu succes." };
          }
     }
}
