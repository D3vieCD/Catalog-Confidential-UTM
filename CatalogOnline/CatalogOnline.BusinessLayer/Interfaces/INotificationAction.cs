using CatalogOnline.Domain.Models.Notification;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
    public interface INotificationAction
    {
        NotificationActionResponse GetNotificationsAction(int userId);
        NotificationActionResponse MarkSeenAction(int userId, MarkSeenDto dto);
    }
}
