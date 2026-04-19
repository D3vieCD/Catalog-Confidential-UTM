using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Models.Student
{
     public class UpdateStudentDto
     {
          public string FullName { get; set; } = string.Empty;
          public string Email { get; set; } = string.Empty;
          public string PhoneNumber { get; set; } = string.Empty;
          public DateTime DateUpdated { get; set; }

     }
}
