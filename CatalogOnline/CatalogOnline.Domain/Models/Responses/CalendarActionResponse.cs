using CatalogOnline.Domain.Entities.Calendar;

namespace CatalogOnline.Domain.Models.Responses
{
    public class CalendarActionResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = string.Empty;
        public CalendarEventData? Event { get; set; }
        public List<CalendarEventData>? Events { get; set; }
    }
}