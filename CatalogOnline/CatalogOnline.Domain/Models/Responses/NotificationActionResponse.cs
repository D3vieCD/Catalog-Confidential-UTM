using CatalogOnline.Domain.Models.Notification;

namespace CatalogOnline.Domain.Models.Responses
{
    public class NotificationActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<NotificationDto>? Notifications { get; set; }
    }
}
