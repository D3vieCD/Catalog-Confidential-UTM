using CatalogOnline.Domain.Entities.Students;
namespace CatalogOnline.Domain.Models.Responses
{
     public class StudentActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public StudentData? Student { get; set; }
          public List<StudentData>? Students { get; set; }

     }
}
