using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Notification;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
    public class NotificationService : NotificationActions, INotificationAction
    {
        public NotificationActionResponse GetNotificationsAction(int userId)
        {
            return GetNotificationsActionExecution(userId);
        }

        public NotificationActionResponse MarkSeenAction(int userId, MarkSeenDto dto)
        {
            return MarkSeenActionExecution(userId, dto);
        }
    }
}
