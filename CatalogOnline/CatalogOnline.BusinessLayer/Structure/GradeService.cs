using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Grade;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class GradeService : GradeActions, IGradeAction
     {
          public GradeActionResponse CreateGradeAction(CreateGradeDto createData)
          {
               return CreateGradeActionExecution(createData);
          }
          public GradeActionResponse DeleteGradeAction(int id)
          {
               return DeleteGradeActionExecution(id);
          }
          public GradeActionResponse UpdateGradeAction(int gradeId, UpdateGradeDto gradeData)
          {
               return UpdateGradeActionExecution(gradeId, gradeData);
          }
          public GradeActionResponse GetAllGradesAction()
          {
               return GetAllGradesActionExecution();
          }
          public GradeActionResponse GetGradeByIdAction(int id)
          {
               return GetGradeByIdActionExecution(id);
          }
     }
}