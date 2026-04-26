using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CatalogOnline.Domain.Entities.User
{
     public class EmailVerificationData
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          public int UserId { get; set; }

          [ForeignKey(nameof(UserId))]
          [JsonIgnore]
          public UserData User { get; set; } = null!;

          [Required]
          [StringLength(6)]
          public string Code { get; set; } = string.Empty;

          [Required]
          public DateTime ExpiresAt { get; set; }

          public bool IsUsed { get; set; } = false;
     }
}
