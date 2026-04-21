using CatalogOnline.Domain.Models.Calendar;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
    public interface ICalendarAction
    {
        CalendarActionResponse GetAllEventsAction();
        CalendarActionResponse GetEventByIdAction(int id);
        CalendarActionResponse GetEventsByUserIdAction(int userId);
        CalendarActionResponse CreateEventAction(CreateCalendarEventDto createData);
        CalendarActionResponse UpdateEventAction(int eventId, UpdateCalendarEventDto updateData);
        CalendarActionResponse DeleteEventAction(int id);
    }
}