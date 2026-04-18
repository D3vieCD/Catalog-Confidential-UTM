using CatalogOnline.Domain.Entities.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.Domain.Models.Responses
{
     public class UserActionResponse
     {
          public bool IsValid { get; set; }
          public string Message { get; set; } = string.Empty;
          public UserData? User { get; set; }
          public List<UserData>? Users { get; set; }
     }
}
