using CatalogOnline.Domain.Entities.Group;
using CatalogOnline.Domain.Entities.User;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CatalogOnline.Domain.Entities.Report
{
     public class ImportLogData
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
          public int GroupId { get; set; }

          [ForeignKey(nameof(GroupId))]
          [JsonIgnore]
          public GroupData Group { get; set; } = null!;

          [Required]
          public int StudentCount { get; set; }

          [Required]
          public DateTime ImportedAt { get; set; } = DateTime.UtcNow;
     }
}
