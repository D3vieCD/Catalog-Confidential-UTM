using CatalogOnline.Domain.Entities.Evaluation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Models.Responses
{
     public class EvaluationActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public EvaluationData? Evaluation { get; set; }
          public List<EvaluationData>? Evaluations { get; set; }
     }
}
