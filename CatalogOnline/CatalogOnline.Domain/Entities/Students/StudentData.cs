using CatalogOnline.Domain.Entities.Group;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Entities.Students
{
     public class StudentData
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }
          [Required]
          [StringLength(50)]
          public string FullName { get; set; } = string.Empty;

          [Required]
          [StringLength(30, MinimumLength = 7)]
          [DataType(DataType.EmailAddress)]
          public string Email { get; set; } = string.Empty;

          [Required]
          [StringLength(13, MinimumLength = 4)]
          [DataType(DataType.PhoneNumber)]
          public string PhoneNumber { get; set; } = string.Empty;

          [Required]
          public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
          [Required]
          public int GroupId { get; set; } 

          [ForeignKey(nameof(GroupId))]
          [JsonIgnore]
          public GroupData Group { get; set; } = null!;
          
     }
}
