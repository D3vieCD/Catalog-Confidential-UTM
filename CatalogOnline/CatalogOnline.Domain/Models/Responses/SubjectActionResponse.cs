using CatalogOnline.Domain.Entities.Subject;

namespace CatalogOnline.Domain.Models.Responses
{
     public class SubjectActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public SubjectData? Subject { get; set; }
          public List<SubjectData>? Subjects { get; set; }
     }
}
