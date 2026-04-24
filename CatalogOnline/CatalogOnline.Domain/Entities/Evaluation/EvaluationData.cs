using CatalogOnline.Domain.Entities.Subject;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Entities.Evaluation
{
     public class EvaluationData
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          public int SubjectId { get; set; }

          [ForeignKey(nameof(SubjectId))]
          [JsonIgnore]
          public SubjectData Subject { get; set; } = null!;

          [Required]
          [StringLength(500)]
          public string Name { get; set; } = string.Empty;

          [Required]
          [StringLength(50)]
          public string Type { get; set; } = string.Empty;

          [Required]
          public DateTime Date { get; set; } = DateTime.UtcNow;

          [JsonIgnore]
          public List<Entities.Grade.GradeData> Grades { get; set; } = new List<Entities.Grade.GradeData>();

          [JsonIgnore]
          public List<Entities.Absence.AbsenceData> Absences { get; set; } = new List<Entities.Absence.AbsenceData>();
     }
}
