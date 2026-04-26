namespace CatalogOnline.Domain.Models.Responses
{
     public class AuthActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public string? Token { get; set; }
          public int? UserId { get; set; }
          public string? UserName { get; set; }
          public string? Email { get; set; }
          public string? Role { get; set; }
          public string? FirstName { get; set; }
          public string? LastName { get; set; }
          public string? Phone { get; set; }
          public string? Bio { get; set; }
     }
}
