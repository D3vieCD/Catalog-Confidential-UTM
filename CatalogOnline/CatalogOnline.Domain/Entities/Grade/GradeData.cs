using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalogOnline.Domain.Entities.Grade
{
     public class GradeData
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }
          public int StudentId { get; set; }

          [Required]
          public string SubjectName { get; set; } = string.Empty;

          [Required]
          public int GradeValue { get; set; }


          public DateTime DateAwarded { get; set; }
     }
}