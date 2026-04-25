using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Absence;
using CatalogOnline.Domain.Models.Absence;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Core
{
     public class AbsenceActions
     {
          public AbsenceActionResponse CreateAbsenceActionExecution(CreateAbsenceDto createData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    if (createData.EvaluationId.HasValue)
                    {
                         var existing = appDbContext.Absence
                              .FirstOrDefault(a => a.StudentId == createData.StudentId && a.EvaluationId == createData.EvaluationId);
                         if (existing != null)
                              return new AbsenceActionResponse { IsValid = true, Message = "Absence already exists.", Absence = existing };
                    }
                    var absence = new AbsenceData
                    {
                         StudentId = createData.StudentId,
                         SubjectName = createData.SubjectName,
                         Date = createData.Date,
                         IsMotivated = createData.IsMotivated,
                         EvaluationId = createData.EvaluationId
                    };
                    appDbContext.Absence.Add(absence);
                    appDbContext.SaveChanges();
                    return new AbsenceActionResponse
                    {
                         IsValid = true,
                         Message = "Absence created successfully.",
                         Absence = absence
                    };
               }
          }

          public AbsenceActionResponse DeleteAbsenceActionExecution(int absenceId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var absence = appDbContext.Absence.Find(absenceId);
                    if (absence == null)
                         return new AbsenceActionResponse { IsValid = false, Message = "Absence not found." };

                    appDbContext.Absence.Remove(absence);
                    appDbContext.SaveChanges();
                    return new AbsenceActionResponse { IsValid = true, Message = "Absence deleted successfully." };
               }
          }

          public AbsenceActionResponse UpdateAbsenceActionExecution(int absenceId, UpdateAbsenceDto updateData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var absence = appDbContext.Absence.Find(absenceId);
                    if (absence == null)
                         return new AbsenceActionResponse { IsValid = false, Message = "Absence not found." };

                    absence.SubjectName = updateData.SubjectName;
                    absence.Date = updateData.Date;
                    absence.IsMotivated = updateData.IsMotivated;
                    absence.EvaluationId = updateData.EvaluationId;
                    appDbContext.SaveChanges();
                    return new AbsenceActionResponse { IsValid = true, Message = "Absence updated successfully.", Absence = absence };
               }
          }

          public AbsenceActionResponse GetAbsenceByIdActionExecution(int absenceId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var absence = appDbContext.Absence.Find(absenceId);
                    return new AbsenceActionResponse
                    {
                         IsValid = absence != null,
                         Message = absence != null ? "Absence retrieved successfully." : "Absence not found.",
                         Absence = absence
                    };
               }
          }

          public AbsenceActionResponse GetAllAbsencesActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var absences = appDbContext.Absence.ToList();
                    return new AbsenceActionResponse
                    {
                         IsValid = true,
                         Message = "Absences retrieved successfully.",
                         Absences = absences
                    };
               }
          }

          public AbsenceActionResponse GetAbsencesByStudentIdActionExecution(int studentId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var absences = appDbContext.Absence
                         .Where(a => a.StudentId == studentId)
                         .ToList();
                    return new AbsenceActionResponse
                    {
                         IsValid = true,
                         Message = "Absences retrieved successfully.",
                         Absences = absences
                    };
               }
          }
     }
}
