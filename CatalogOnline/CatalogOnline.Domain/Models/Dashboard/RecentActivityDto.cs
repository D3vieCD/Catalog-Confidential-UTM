namespace CatalogOnline.Domain.Models.Dashboard
{
     public class RecentActivityDto
     {
          public int Id { get; set; }
          public string StudentName { get; set; }
          public string Action { get; set; }
          public string Details { get; set; }
          public string Time { get; set; }
          public string Type { get; set; }
          public DateTime SortDate { get; set; }
     }
}
