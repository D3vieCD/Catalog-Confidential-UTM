using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Subject;
using CatalogOnline.Domain.Models.Subject;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Core
{
     public class SubjectActions
     {
          public SubjectActionResponse CreateSubjectActionExecution(CreateSubjectDto createData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var exists = appDbContext.Subject
                         .Any(s => s.GroupId == createData.GroupId && s.SubjectName == createData.SubjectName);
                    if (exists)
                         return new SubjectActionResponse { IsValid = false, Message = "Subject already exists for this group." };

                    var subject = new SubjectData
                    {
                         GroupId = createData.GroupId,
                         SubjectName = createData.SubjectName
                    };
                    appDbContext.Subject.Add(subject);
                    appDbContext.SaveChanges();
                    return new SubjectActionResponse
                    {
                         IsValid = true,
                         Message = "Subject created successfully.",
                         Subject = subject
                    };
               }
          }

          public SubjectActionResponse DeleteSubjectActionExecution(int subjectId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var subject = appDbContext.Subject.Find(subjectId);
                    if (subject == null)
                         return new SubjectActionResponse { IsValid = false, Message = "Subject not found." };

                    appDbContext.Subject.Remove(subject);
                    appDbContext.SaveChanges();
                    return new SubjectActionResponse { IsValid = true, Message = "Subject deleted successfully." };
               }
          }

          public SubjectActionResponse GetSubjectsByGroupIdActionExecution(int groupId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var subjects = appDbContext.Subject
                         .Where(s => s.GroupId == groupId)
                         .ToList();
                    return new SubjectActionResponse
                    {
                         IsValid = true,
                         Message = "Subjects retrieved successfully.",
                         Subjects = subjects
                    };
               }
          }
     }
}
