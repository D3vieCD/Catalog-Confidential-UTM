using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Calendar;
using CatalogOnline.Domain.Models.Calendar;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Core
{
    public class CalendarActions
    {
        public CalendarActionResponse CreateEventActionExecution(CreateCalendarEventDto createData)
        {
            using (var db = new AppDbContext())
            {
                var ev = new CalendarEventData
                {
                    Title = createData.Title,
                    Description = createData.Description,
                    StartDate = createData.StartDate,
                    EndDate = createData.EndDate,
                    Color = createData.Color,
                    EventType = createData.EventType,
                    UserId = createData.UserId
                };
                db.CalendarEvents.Add(ev);
                db.SaveChanges();
                return new CalendarActionResponse { IsValid = true, Message = "Event created successfully." };
            }
        }

        public CalendarActionResponse GetAllEventsActionExecution()
        {
            using (var db = new AppDbContext())
            {
                var events = db.CalendarEvents.ToList();
                return new CalendarActionResponse { IsValid = true, Events = events };
            }
        }

        public CalendarActionResponse GetEventByIdActionExecution(int eventId)
        {
            using (var db = new AppDbContext())
            {
                var ev = db.CalendarEvents.Find(eventId);
                return new CalendarActionResponse
                {
                    IsValid = ev != null,
                    Message = ev != null ? "Event found." : "Event not found.",
                    Event = ev
                };
            }
        }

        public CalendarActionResponse GetEventsByUserIdActionExecution(int userId)
        {
            using (var db = new AppDbContext())
            {
                var events = db.CalendarEvents.Where(e => e.UserId == userId).ToList();
                return new CalendarActionResponse { IsValid = true, Events = events };
            }
        }

        public CalendarActionResponse UpdateEventActionExecution(int eventId, UpdateCalendarEventDto updateData)
        {
            using (var db = new AppDbContext())
            {
                var ev = db.CalendarEvents.Find(eventId);
                if (ev == null)
                    return new CalendarActionResponse { IsValid = false, Message = "Event not found." };
                ev.Title = updateData.Title;
                ev.Description = updateData.Description;
                ev.StartDate = updateData.StartDate;
                ev.EndDate = updateData.EndDate;
                ev.Color = updateData.Color;
                ev.EventType = updateData.EventType;
                db.SaveChanges();
                return new CalendarActionResponse { IsValid = true, Message = "Event updated successfully." };
            }
        }

        public CalendarActionResponse DeleteEventActionExecution(int eventId)
        {
            using (var db = new AppDbContext())
            {
                var ev = db.CalendarEvents.Find(eventId);
                if (ev == null)
                    return new CalendarActionResponse { IsValid = false, Message = "Event not found." };
                db.CalendarEvents.Remove(ev);
                db.SaveChanges();
                return new CalendarActionResponse { IsValid = true, Message = "Event deleted successfully." };
            }
        }
    }
}