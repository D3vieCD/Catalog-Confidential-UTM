namespace CatalogOnline.Domain.Models.Auth
{
     public class AuthUpdateProfileDto
     {
          public string FirstName { get; set; } = string.Empty;
          public string LastName { get; set; } = string.Empty;
          public string? Phone { get; set; }
          public string? Bio { get; set; }
     }
}
