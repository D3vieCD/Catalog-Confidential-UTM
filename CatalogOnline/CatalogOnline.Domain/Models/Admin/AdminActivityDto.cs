namespace CatalogOnline.Domain.Models.Admin
{
     public class AdminActivityDto
     {
          public int Id { get; set; }
          public string Action { get; set; } = string.Empty;
          public string Target { get; set; } = string.Empty;
          public string Timestamp { get; set; } = string.Empty;
          public string Type { get; set; } = string.Empty;
     }
}
