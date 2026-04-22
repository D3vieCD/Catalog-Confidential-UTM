namespace CatalogOnline.Domain.Models.Calendar
{
    public class CreateCalendarEventDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Color { get; set; }
        public string? EventType { get; set; }
        public int UserId { get; set; }
    }
}