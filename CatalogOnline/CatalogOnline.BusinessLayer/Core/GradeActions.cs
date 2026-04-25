using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Grade;
using CatalogOnline.Domain.Models.Grade;
using CatalogOnline.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.BusinessLayer.Core
{
     public class GradeActions
     {
          public GradeActionResponse CreateGradeActionExecution(CreateGradeDto createData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    if (createData.EvaluationId.HasValue)
                    {
                         var existing = appDbContext.Grade
                              .FirstOrDefault(g => g.StudentId == createData.StudentId && g.EvaluationId == createData.EvaluationId);
                         if (existing != null)
                         {
                              existing.GradeValue = createData.GradeValue;
                              existing.DateAwarded = createData.DateAwarded;
                              appDbContext.SaveChanges();
                              return new GradeActionResponse { IsValid = true, Message = "Grade updated successfully.", Grade = existing };
                         }
                    }
                    var grade = new GradeData
                    {
                         StudentId = createData.StudentId,
                         SubjectName = createData.SubjectName,
                         GradeValue = createData.GradeValue,
                         DateAwarded = createData.DateAwarded,
                         EvaluationId = createData.EvaluationId
                    };
                    appDbContext.Grade.Add(grade);
                    appDbContext.SaveChanges();
                    return new GradeActionResponse
                    {
                         IsValid = true,
                         Message = "Grade created successfully.",
                         Grade = grade
                    };
               }
          }

          public GradeActionResponse DeleteGradeActionExecution(int gradeId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grade = appDbContext.Grade.Find(gradeId);
                    if (grade == null)
                         return new GradeActionResponse { IsValid = false, Message = "Grade not found." };

                    appDbContext.Grade.Remove(grade);
                    appDbContext.SaveChanges();
                    return new GradeActionResponse { IsValid = true, Message = "Grade deleted successfully." };
               }
          }

          public GradeActionResponse UpdateGradeActionExecution(int gradeId, UpdateGradeDto updateData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grade = appDbContext.Grade.Find(gradeId);
                    if (grade == null)
                         return new GradeActionResponse { IsValid = false, Message = "Grade not found." };

                    grade.SubjectName = updateData.SubjectName;
                    grade.GradeValue = updateData.GradeValue;
                    grade.DateAwarded = updateData.DateAwarded;
                    grade.EvaluationId = updateData.EvaluationId;
                    appDbContext.SaveChanges();
                    return new GradeActionResponse { IsValid = true, Message = "Grade updated successfully.", Grade = grade };
               }
          }

          public GradeActionResponse GetGradeByIdActionExecution(int gradeId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grade = appDbContext.Grade.Find(gradeId);
                    return new GradeActionResponse
                    {
                         IsValid = grade != null,
                         Message = grade != null ? "Grade retrieved successfully." : "Grade not found.",
                         Grade = grade
                    };
               }
          }

          public GradeActionResponse GetAllGradesActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grades = appDbContext.Grade.ToList();
                    return new GradeActionResponse
                    {
                         IsValid = true,
                         Message = "Grades retrieved successfully.",
                         Grades = grades
                    };
               }
          }

          public GradeActionResponse GetGradesByStudentIdActionExecution(int studentId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grades = appDbContext.Grade
                         .Where(g => g.StudentId == studentId)
                         .ToList();
                    return new GradeActionResponse
                    {
                         IsValid = true,
                         Message = "Grades retrieved successfully.",
                         Grades = grades
                    };
               }
          }
     }
}
