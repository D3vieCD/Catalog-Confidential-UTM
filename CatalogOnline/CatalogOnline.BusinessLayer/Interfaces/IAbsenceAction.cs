using CatalogOnline.Domain.Models.Absence;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IAbsenceAction
     {
          AbsenceActionResponse GetAllAbsencesAction();
          AbsenceActionResponse GetAbsenceByIdAction(int id);
          AbsenceActionResponse GetAbsencesByStudentIdAction(int studentId);
          AbsenceActionResponse CreateAbsenceAction(CreateAbsenceDto createData);
          AbsenceActionResponse UpdateAbsenceAction(int absenceId, UpdateAbsenceDto updateData);
          AbsenceActionResponse DeleteAbsenceAction(int id);
     }
}
