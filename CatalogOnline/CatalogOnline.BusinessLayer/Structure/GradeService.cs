using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Grade;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class GradeService : GradeActions, IGradeAction
     {
          public DefaultActionResponse CreateGradeAction(CreateGradeDto createData)
          {
               return CreateGradeActionExecution(createData);
          }
          public DefaultActionResponse DeleteGradeAction(int id)
          {
               return DeleteGradeActionExecution(id);
          }
          public DefaultActionResponse UpdateGradeAction(int gradeId, UpdateGradeDto gradeData)
          {
               return UpdateGradeActionExecution(gradeId, gradeData);
          }
          public DefaultActionResponse GetAllGradesAction()
          {
               return GetAllGradesActionExecution();
          }
          public DefaultActionResponse GetGradeByIdAction(int id)
          {
               return GetGradeByIdActionExecution(id);
          }
     }
}