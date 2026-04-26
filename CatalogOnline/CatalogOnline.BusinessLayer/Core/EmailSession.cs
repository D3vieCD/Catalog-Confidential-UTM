namespace CatalogOnline.BusinessLayer.Core
{
     public static class EmailSession
     {
          public static string From { get; set; } = string.Empty;
          public static string Host { get; set; } = string.Empty;
          public static int Port { get; set; } = 587;
          public static string UserName { get; set; } = string.Empty;
          public static string Password { get; set; } = string.Empty;
     }
}
