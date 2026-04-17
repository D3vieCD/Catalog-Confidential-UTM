using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.BusinessLayer.Structure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.BusinessLayer
{
     public class BusinessLogic
     {
          public IHealthAction GetHealth()
          {
               return new HealthService();
          }
          public IUserAction UserAction()
          {
               return new UserService(); // get from the structure folder
          }
          public IGradeAction GradeAction()
          {
               return new GradeService(); // get from the structure folder
          }
          public IGroupAction GroupAction()
          {
               return new GroupService();
          }
     }
}
