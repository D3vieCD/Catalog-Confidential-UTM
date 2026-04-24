using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Models.Evaluation
{
     public class CreateEvaluationDto
     {
          public int SubjectId { get; set; }
          public string Name { get; set; } = string.Empty;
          public string Type { get; set; } = string.Empty;
          public DateTime Date { get; set; } = DateTime.UtcNow;
     }
}
