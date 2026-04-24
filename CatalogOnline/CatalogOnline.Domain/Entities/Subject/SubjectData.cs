using CatalogOnline.Domain.Entities.Evaluation;
using CatalogOnline.Domain.Entities.Group;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Entities.Subject
{
     public class SubjectData
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          public int GroupId { get; set; }

          [ForeignKey(nameof(GroupId))]
          [JsonIgnore]
          public GroupData Group { get; set; } = null!;

          [Required]
          [StringLength(100)]
          public string SubjectName { get; set; } = string.Empty;

          [JsonIgnore]
          public List<EvaluationData> Evaluations { get; set; } = new List<EvaluationData>();
     }
}
