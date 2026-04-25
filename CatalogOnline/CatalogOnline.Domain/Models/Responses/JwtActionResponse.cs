namespace CatalogOnline.Domain.Models.Responses
{
     public class JwtActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public string? Token { get; set; }
     }
}
