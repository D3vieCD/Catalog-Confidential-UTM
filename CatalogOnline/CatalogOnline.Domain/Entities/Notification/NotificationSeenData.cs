using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalogOnline.Domain.Entities.Notification
{
    public class NotificationSeenData
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string NotifKey { get; set; } = string.Empty;

        public DateTime SeenAt { get; set; } = DateTime.UtcNow;
    }
}
