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
          public ITeacherAction TeacherAction()
          {
               return new TeacherService(); // get from the structure folder
          }
     }
}
