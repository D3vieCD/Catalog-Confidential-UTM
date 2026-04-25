using CatalogOnline.Domain.Models.Settings;

namespace CatalogOnline.Domain.Models.Responses
{
     public class SettingsActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public SettingsProfileDto? Profile { get; set; }
     }
}
