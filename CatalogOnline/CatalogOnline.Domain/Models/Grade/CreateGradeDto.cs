using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Models.Grade
{
     public class CreateGradeDto

     {
          public int StudentId { get; set; }
          public int? EvaluationId { get; set; }
          public string SubjectName { get; set; } = string.Empty;
          public int GradeValue { get; set; }
          public DateTime DateAwarded { get; set; }
     }
}
