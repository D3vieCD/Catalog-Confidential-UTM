using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IJwtAction
     {
          JwtActionResponse GenerateTokenAction(int id, string username, string role);
     }
}
