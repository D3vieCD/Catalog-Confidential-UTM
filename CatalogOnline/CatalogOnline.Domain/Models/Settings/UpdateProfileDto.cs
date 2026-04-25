namespace CatalogOnline.Domain.Models.Settings
{
     public class UpdateProfileDto
     {
          public string UserName { get; set; } = string.Empty;
          public string? Phone { get; set; }
          public string? Bio { get; set; }
          public string? Avatar { get; set; }
     }
}
