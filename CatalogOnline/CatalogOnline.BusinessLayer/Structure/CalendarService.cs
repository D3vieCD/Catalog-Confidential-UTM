using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Calendar;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
    public class CalendarService : ICalendarAction
    {
        private readonly CalendarActions _calendarActions = new CalendarActions();

        public CalendarActionResponse GetAllEventsAction()
            => _calendarActions.GetAllEventsActionExecution();

        public CalendarActionResponse GetEventByIdAction(int id)
            => _calendarActions.GetEventByIdActionExecution(id);

        public CalendarActionResponse GetEventsByUserIdAction(int userId)
            => _calendarActions.GetEventsByUserIdActionExecution(userId);

        public CalendarActionResponse CreateEventAction(CreateCalendarEventDto createData)
            => _calendarActions.CreateEventActionExecution(createData);

        public CalendarActionResponse UpdateEventAction(int eventId, UpdateCalendarEventDto updateData)
            => _calendarActions.UpdateEventActionExecution(eventId, updateData);

        public CalendarActionResponse DeleteEventAction(int id)
            => _calendarActions.DeleteEventActionExecution(id);
    }
}