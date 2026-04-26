namespace CatalogOnline.Domain.Models.Admin
{
     public class AdminStudentDto
     {
          public int Id { get; set; }
          public string FullName { get; set; } = string.Empty;
          public string Email { get; set; } = string.Empty;
          public string GroupName { get; set; } = string.Empty;
          public string Faculty { get; set; } = string.Empty;
          public int Year { get; set; }
          public double Average { get; set; }
          public int Absences { get; set; }
     }
}
