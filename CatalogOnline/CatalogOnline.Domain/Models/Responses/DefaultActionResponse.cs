using CatalogOnline.Domain.Entities.Grade;
using CatalogOnline.Domain.Entities.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Models.Responses
{
     public class DefaultActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; }
          public UserData? User { get; set; }
          public List<UserData>? Users { get; set; }
          public GradeData? Grade { get; set; }
          public List<GradeData>? Grades { get; set; }
     }
}
