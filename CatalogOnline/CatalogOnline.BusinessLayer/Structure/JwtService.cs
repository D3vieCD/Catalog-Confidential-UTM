using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class JwtService : JwtActions, IJwtAction
     {
          public JwtActionResponse GenerateTokenAction(int id, string username, string role)
          {
               return GenerateTokenActionExecution(id, username, role);
          }
     }
}
