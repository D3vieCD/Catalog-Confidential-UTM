
using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class HealthService: HealthActions, IHealthAction
     {
          public string CheckHealthAction() 
          {
               return CheckHealthActionExecution();
          }
          
     }
}