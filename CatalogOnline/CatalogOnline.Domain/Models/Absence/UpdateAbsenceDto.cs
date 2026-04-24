namespace CatalogOnline.Domain.Models.Absence
{
     public class UpdateAbsenceDto
     {
          public int? EvaluationId { get; set; }
          public string SubjectName { get; set; } = string.Empty;
          public DateTime Date { get; set; }
          public bool IsMotivated { get; set; }
     }
}
