using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Grade;
using CatalogOnline.Domain.Models.Grade;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Core
{
     public class GradeActions
     {
          public DefaultActionResponse CreateGradeActionExecution(CreateGradeDto createData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grade = new GradeData
                    {
                         StudentId = createData.StudentId,
                         SubjectName = createData.SubjectName,
                         GradeValue = createData.GradeValue,
                         DateAwarded = createData.DateAwarded
                    };
                    appDbContext.Grade.Add(grade);
                    appDbContext.SaveChanges();
                    return new DefaultActionResponse
                    {
                         IsValid = true,
                         Message = "Grade created successfully."
                    };
               }
          }

          public DefaultActionResponse DeleteGradeActionExecution(int gradeId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grade = appDbContext.Grade.Find(gradeId);
                    if (grade == null)
                         return new DefaultActionResponse { IsValid = false, Message = "Grade not found." };

                    appDbContext.Grade.Remove(grade);
                    appDbContext.SaveChanges();
                    return new DefaultActionResponse { IsValid = true, Message = "Grade deleted successfully." };
               }
          }

          public DefaultActionResponse UpdateGradeActionExecution(int gradeId, UpdateGradeDto updateData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grade = appDbContext.Grade.Find(gradeId);
                    if (grade == null)
                         return new DefaultActionResponse { IsValid = false, Message = "Grade not found." };

                    grade.StudentId = updateData.StudentId;
                    grade.SubjectName = updateData.SubjectName;
                    grade.GradeValue = updateData.GradeValue;
                    grade.DateAwarded = updateData.DateAwarded;
                    appDbContext.SaveChanges();
                    return new DefaultActionResponse { IsValid = true, Message = "Grade updated successfully." };
               }
          }

          public DefaultActionResponse GetGradeByIdActionExecution(int gradeId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grade = appDbContext.Grade.Find(gradeId);
                    return new DefaultActionResponse
                    {
                         IsValid = grade != null,
                         Message = grade != null ? "Grade retrieved successfully." : "Grade not found.",
                         Grade = grade
                    };
               }
          }

          public DefaultActionResponse GetAllGradesActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var grades = appDbContext.Grade.ToList();
                    return new DefaultActionResponse
                    {
                         IsValid = true,
                         Message = "Grades retrieved successfully.",
                         Grades = grades
                    };
               }
          }
     }
}