namespace CatalogOnline.Domain.Entities.Grade
{
     public class GradeData
     {
          public int Id { get; set; }
          public int StudentId { get; set; }
          public string SubjectName { get; set; }
          public int GradeValue { get; set; }
          public DateTime DateAwarded { get; set; }
     }
}