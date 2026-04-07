using CatalogOnline.BusinessLayer;
using CatalogOnline.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CatalogOnline.API.Controller
{
     [Route("api/health")]
     [ApiController]
     public class HealthController : ControllerBase
     {
          private readonly IHealthAction _healthAction;
          public HealthController() {
               var bl= new BusinessLogic();
               _healthAction=bl.GetHealth(); 
          }
          [HttpGet]
          public IActionResult Get()
          {

               return Ok(_healthAction.CheckHealthAction());
          }
     }
}