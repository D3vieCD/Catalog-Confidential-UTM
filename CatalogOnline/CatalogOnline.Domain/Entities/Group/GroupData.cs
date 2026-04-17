using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Entities.Group
{
     public class GroupData   
     {
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
