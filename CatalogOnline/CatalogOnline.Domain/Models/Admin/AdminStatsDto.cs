namespace CatalogOnline.Domain.Models.Admin
{
     public class AdminStatsDto
     {
          public int TotalUsers { get; set; }
          public int TotalStudents { get; set; }
          public int TotalGroups { get; set; }
          public double GlobalAverage { get; set; }
     }
}
