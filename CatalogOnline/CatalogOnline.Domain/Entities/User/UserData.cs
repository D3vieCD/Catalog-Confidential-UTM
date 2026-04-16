using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalogOnline.Domain.Entities.User
{
     public class UserData
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }

          [Required]
          [StringLength(30)]
          public string FirstName { get; set; }

          [Required]
          [StringLength(30)]
          public string LastName { get; set; }

          [Required]
          [StringLength(30, MinimumLength = 4)]
          public string UserName { get; set; }

          [Required]
          [StringLength(50)]
          [DataType(DataType.EmailAddress)]
          public string Email { get; set; }

          [Required]
          [StringLength(48, MinimumLength = 8)]
          public string Password { get; set; }

          [DataType(DataType.Date)]
          public DateTime CreatedOn { get; set; }
     }
}