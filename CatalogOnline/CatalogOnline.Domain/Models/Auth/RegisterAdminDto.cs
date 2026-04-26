namespace CatalogOnline.Domain.Models.Auth
{
     public class RegisterAdminDto
     {
          public string UserName { get; set; } = string.Empty;
          public string FirstName { get; set; } = string.Empty;
          public string LastName { get; set; } = string.Empty;
          public string Email { get; set; } = string.Empty;
          public string Password { get; set; } = string.Empty;
          public string ConfirmPassword { get; set; } = string.Empty;
          public string SecretKey { get; set; } = string.Empty;
     }
}
