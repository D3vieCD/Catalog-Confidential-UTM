using System.ComponentModel.DataAnnotations;

namespace CatalogOnline.Domain.Models.Auth
{
     public class ResetPasswordTokenDto
     {
          [Required]
          public string Token { get; set; } = string.Empty;

          [Required]
          public string NewPassword { get; set; } = string.Empty;

          [Required]
          public string ConfirmPassword { get; set; } = string.Empty;
     }
}
