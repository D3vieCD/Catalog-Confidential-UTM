using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Notification;
using CatalogOnline.Domain.Models.Notification;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Core
{
    public class NotificationActions
    {
        public NotificationActionResponse GetNotificationsActionExecution(int userId)
        {
            using var db = new AppDbContext();

            var now = DateTime.UtcNow;
            var fiveDaysLater = now.AddDays(5);

            var events = db.CalendarEvents
                .Where(e => e.UserId == userId && e.StartDate > now && e.StartDate <= fiveDaysLater)
                .OrderBy(e => e.StartDate)
                .ToList();

            var seenKeys = db.NotificationSeen
                .Where(s => s.UserId == userId)
                .Select(s => s.NotifKey)
                .ToHashSet();

            var notifications = events.Select(e =>
            {
                var msUntil = (e.StartDate - now).TotalMilliseconds;
                var notifKey = BuildNotifKey(e.Id, msUntil);
                return new NotificationDto
                {
                    EventId = e.Id,
                    Title = e.Title,
                    StartDate = e.StartDate,
                    EventType = e.EventType ?? "class",
                    Color = e.Color ?? "#3b82f6",
                    NotifKey = notifKey,
                    IsSeen = seenKeys.Contains(notifKey)
                };
            }).ToList();

            return new NotificationActionResponse
            {
                IsValid = true,
                Notifications = notifications
            };
        }

        public NotificationActionResponse MarkSeenActionExecution(int userId, MarkSeenDto dto)
        {
            using var db = new AppDbContext();

            var existingKeys = db.NotificationSeen
                .Where(s => s.UserId == userId)
                .Select(s => s.NotifKey)
                .ToHashSet();

            var newEntries = dto.NotifKeys
                .Where(k => !existingKeys.Contains(k))
                .Select(k => new NotificationSeenData
                {
                    UserId = userId,
                    NotifKey = k,
                    SeenAt = DateTime.UtcNow
                })
                .ToList();

            if (newEntries.Any())
            {
                db.NotificationSeen.AddRange(newEntries);
                db.SaveChanges();
            }

            return new NotificationActionResponse
            {
                IsValid = true,
                Message = "Marcat ca vizualizat."
            };
        }

        private static string BuildNotifKey(int eventId, double msUntil)
        {
            var hours = msUntil / 1000.0 / 3600.0;
            if (hours <= 1)  return $"{eventId}-1hour";
            if (hours <= 24) return $"{eventId}-1day";
            return $"{eventId}-5days";
        }
    }
}
