using System.ComponentModel.DataAnnotations;

namespace CatalogOnline.Domain.Models.Auth
{
     public class VerifyEmailDto
     {
          [Required]
          public int UserId { get; set; }

          [Required]
          public string Code { get; set; } = string.Empty;
     }
}
