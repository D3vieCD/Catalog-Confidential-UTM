using CatalogOnline.Domain.Entities.Evaluation;
using CatalogOnline.Domain.Entities.Students;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CatalogOnline.Domain.Entities.Absence
{
     public class AbsenceData
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          public int StudentId { get; set; }

          [ForeignKey(nameof(StudentId))]
          [JsonIgnore]
          public StudentData Student { get; set; } = null!;

          public int? EvaluationId { get; set; }

          [ForeignKey(nameof(EvaluationId))]
          [JsonIgnore]
          public EvaluationData? Evaluation { get; set; }

          [Required]
          public string SubjectName { get; set; } = string.Empty;

          [Required]
          public DateTime Date { get; set; } = DateTime.UtcNow;

          [Required]
          public bool IsMotivated { get; set; } = false;
     }
}
