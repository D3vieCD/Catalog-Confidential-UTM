namespace CatalogOnline.Domain.Models.Auth
{
     public class AuthChangePasswordDto
     {
          public string OldPassword { get; set; } = string.Empty;
          public string NewPassword { get; set; } = string.Empty;
          public string ConfirmPassword { get; set; } = string.Empty;
     }
}
