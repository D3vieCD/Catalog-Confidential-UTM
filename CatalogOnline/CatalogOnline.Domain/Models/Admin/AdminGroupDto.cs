namespace CatalogOnline.Domain.Models.Admin
{
     public class AdminGroupDto
     {
          public int Id { get; set; }
          public string GroupName { get; set; } = string.Empty;
          public string Coordinator { get; set; } = string.Empty;
          public string Faculty { get; set; } = string.Empty;
          public int Year { get; set; }
          public int StudentCount { get; set; }
          public double Average { get; set; }
          public int Absences { get; set; }
          public bool IsArchived { get; set; }
     }
}
