using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Grade;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IGradeAction
     {
          DefaultActionResponse GetAllGradesAction();
          DefaultActionResponse GetGradeByIdAction(int id);
          DefaultActionResponse CreateGradeAction(CreateGradeDto createData);
          DefaultActionResponse UpdateGradeAction(int gradeId, UpdateGradeDto gradeData);
          DefaultActionResponse DeleteGradeAction(int id);
     }
}
