using System.ComponentModel.DataAnnotations;

namespace CatalogOnline.Domain.Models.Auth
{
     public class ForgotPasswordDto
     {
          [Required]
          public string Email { get; set; } = string.Empty;
     }
}
