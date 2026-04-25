using CatalogOnline.Domain.Entities.Group;
using CatalogOnline.Domain.Entities.Students;
using CatalogOnline.Domain.Entities.User;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CatalogOnline.Domain.Entities.Report
{
     public class ReportData
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

          public int? StudentId { get; set; }

          [ForeignKey(nameof(StudentId))]
          [JsonIgnore]
          public StudentData? Student { get; set; }

          [Required]
          [StringLength(20)]
          public string ReportType { get; set; } = string.Empty;

          [Required]
          [StringLength(10)]
          public string Format { get; set; } = string.Empty;

          [Required]
          [StringLength(200)]
          public string FileName { get; set; } = string.Empty;

          [Required]
          public byte[] FileData { get; set; } = Array.Empty<byte>();

          [Required]
          public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
     }
}
