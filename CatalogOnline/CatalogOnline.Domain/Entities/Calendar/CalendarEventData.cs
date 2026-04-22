using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalogOnline.Domain.Entities.Calendar
{
    public class CalendarEventData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(30)]
        public string? Color { get; set; }

        [StringLength(50)]
        public string? EventType { get; set; }

        public int UserId { get; set; }

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}