namespace CatalogOnline.Domain.Models.Dashboard
{
     public class DashboardStatsDto
     {
          public int TotalStudents { get; set; }
          public int TotalGrades { get; set; }
          public double AverageGrade { get; set; }
          public int TotalAbsencesThisMonth { get; set; }
     }
}
