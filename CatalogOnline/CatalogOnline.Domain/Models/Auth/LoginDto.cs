namespace CatalogOnline.Domain.Models.Auth
{
     public class LoginDto
     {
          public string Credential { get; set; } = string.Empty; // username sau email
          public string Password { get; set; } = string.Empty;
     }
}
