namespace CatalogOnline.Domain.Models.Notification
{
    public class NotificationDto
    {
        public int EventId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string EventType { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string NotifKey { get; set; } = string.Empty;
        public bool IsSeen { get; set; }
    }
}
