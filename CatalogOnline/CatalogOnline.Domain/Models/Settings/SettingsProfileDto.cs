namespace CatalogOnline.Domain.Models.Settings
{
     public class SettingsProfileDto
     {
          public string UserName { get; set; } = string.Empty;
          public string Email { get; set; } = string.Empty;
          public string? Phone { get; set; }
          public string? Bio { get; set; }
          public string Role { get; set; } = string.Empty;
          public string? Avatar { get; set; }
     }
}
