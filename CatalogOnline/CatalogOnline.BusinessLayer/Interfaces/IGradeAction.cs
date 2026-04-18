using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Grade;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IGradeAction
     {
          GradeActionResponse GetAllGradesAction();
          GradeActionResponse GetGradeByIdAction(int id);
          GradeActionResponse CreateGradeAction(CreateGradeDto createData);
          GradeActionResponse UpdateGradeAction(int gradeId, UpdateGradeDto gradeData);
          GradeActionResponse DeleteGradeAction(int id);
     }
}
