using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Entities.Teacher;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Teacher;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class TeacherService : TeacherActions, ITeacherAction
     {
          public DefaultActionResponse CreateUserAction(CreateTeacherDto createData)
          {
               return CreateUserActionExecution(createData);
          }
     }
}