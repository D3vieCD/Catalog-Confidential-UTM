namespace CatalogOnline.Domain.Models.Absence
{
     public class CreateAbsenceDto
     {
          public int StudentId { get; set; }
          public int? EvaluationId { get; set; }
          public string SubjectName { get; set; } = string.Empty;
          public DateTime Date { get; set; } = DateTime.UtcNow;
          public bool IsMotivated { get; set; } = false;
     }
}
