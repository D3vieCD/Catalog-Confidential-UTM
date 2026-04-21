namespace CatalogOnline.Domain.Models.Absence
{
     public class UpdateAbsenceDto
     {
          public string SubjectName { get; set; } = string.Empty;
          public DateTime Date { get; set; }
          public bool IsMotivated { get; set; }
     }
}
