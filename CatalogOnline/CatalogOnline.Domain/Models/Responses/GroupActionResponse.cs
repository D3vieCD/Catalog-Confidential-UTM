using CatalogOnline.Domain.Entities.Grade;
using CatalogOnline.Domain.Entities.Group;
using CatalogOnline.Domain.Entities.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Models.Responses
{
     public class GroupActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public GroupData? Group { get; set; }
          public List<GroupData>? Groups { get; set; }
     }
}
