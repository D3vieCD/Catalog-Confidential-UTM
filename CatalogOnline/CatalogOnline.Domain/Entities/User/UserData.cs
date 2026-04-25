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
          public string FirstName { get; set; } = string.Empty;

          [Required]
          [StringLength(30)]
          public string LastName { get; set; } = string.Empty;

          [Required]
          [StringLength(30, MinimumLength = 4)]
          public string UserName { get; set; } = string.Empty;

          [Required]
          [StringLength(50)]
          [DataType(DataType.EmailAddress)]
          public string Email { get; set; }= string.Empty;


          [Required]
          [StringLength(100)]
          public string Password { get; set; }= string.Empty;

          [StringLength(20)]
          public string Role { get; set; } = "User";

          [StringLength(20)]
          public string? Phone { get; set; }

          [StringLength(500)]
          public string? Bio { get; set; }

          public string? Avatar { get; set; }

          [DataType(DataType.Date)]
          public DateTime CreatedOn { get; set; } = DateTime.Now;
     }
}