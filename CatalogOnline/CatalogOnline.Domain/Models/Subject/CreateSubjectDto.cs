namespace CatalogOnline.Domain.Models.Subject
{
     public class CreateSubjectDto
     {
          public int GroupId { get; set; }
          public string SubjectName { get; set; } = string.Empty;
     }
}
