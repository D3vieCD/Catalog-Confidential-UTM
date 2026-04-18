using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Entities.Group
{
     public class GroupData   
     {
          [Key]
          [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
          public int Id { get; set; }
          public string? GroupName { get; set; }
          public int Year { get; set; }
          public string? Faculty { get; set; }
          public string? Specialization { get; set; }
          public string? Coordinator { get; set; }
          public int MaxCapacity  { get; set; }
          public int Semester { get; set; }

     }
}
