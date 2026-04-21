using CatalogOnline.Domain.Entities.Absence;

namespace CatalogOnline.Domain.Models.Responses
{
     public class AbsenceActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public AbsenceData? Absence { get; set; }
          public List<AbsenceData>? Absences { get; set; }
     }
}
