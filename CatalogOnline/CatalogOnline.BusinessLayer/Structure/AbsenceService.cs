using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Absence;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class AbsenceService : AbsenceActions, IAbsenceAction
     {
          public AbsenceActionResponse CreateAbsenceAction(CreateAbsenceDto createData)
          {
               return CreateAbsenceActionExecution(createData);
          }
          public AbsenceActionResponse DeleteAbsenceAction(int id)
          {
               return DeleteAbsenceActionExecution(id);
          }
          public AbsenceActionResponse UpdateAbsenceAction(int absenceId, UpdateAbsenceDto updateData)
          {
               return UpdateAbsenceActionExecution(absenceId, updateData);
          }
          public AbsenceActionResponse GetAllAbsencesAction()
          {
               return GetAllAbsencesActionExecution();
          }
          public AbsenceActionResponse GetAbsenceByIdAction(int id)
          {
               return GetAbsenceByIdActionExecution(id);
          }
          public AbsenceActionResponse GetAbsencesByStudentIdAction(int studentId)
          {
               return GetAbsencesByStudentIdActionExecution(studentId);
          }
     }
}
