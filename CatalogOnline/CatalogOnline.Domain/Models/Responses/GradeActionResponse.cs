using CatalogOnline.Domain.Entities.Grade;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Models.Responses
{
     public class GradeActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public GradeData? Grade { get; set; }
          public List<GradeData>? Grades { get; set; }
     }
}
