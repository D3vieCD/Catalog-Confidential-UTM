using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Students;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Student;

namespace CatalogOnline.BusinessLayer.Core
{
     public class StudentActions
     {
          public StudentActionResponse CreateStudentActionExecution(CreateStudentDto createData, int userId)
          {
               using var appDbContext = new AppDbContext();

               var group = appDbContext.Group.FirstOrDefault(g => g.Id == createData.GroupId && g.UserId == userId);
               if (group == null)
                    return new StudentActionResponse { IsValid = false, Message = "Grupa nu a fost găsită sau nu îți aparține." };

               var student = new StudentData
               {
                    FullName = createData.FullName,
                    Email = createData.Email,
                    PhoneNumber = createData.PhoneNumber,
                    GroupId = createData.GroupId,
               };
               appDbContext.Student.Add(student);
               appDbContext.SaveChanges();
               return new StudentActionResponse { IsValid = true, Message = "Student created successfully.", Student = student };
          }

          public StudentActionResponse DeleteStudentActionExecution(int studentId, int userId)
          {
               using var appDbContext = new AppDbContext();
               var student = appDbContext.Student.Find(studentId);
               if (student == null) return new StudentActionResponse { IsValid = false, Message = "Student not found." };

               var group = appDbContext.Group.Find(student.GroupId);
               if (group == null || group.UserId != userId)
                    return new StudentActionResponse { IsValid = false, Message = "Student not found." };

               appDbContext.Student.Remove(student);
               appDbContext.SaveChanges();
               return new StudentActionResponse { IsValid = true, Message = "Student deleted successfully." };
          }

          public StudentActionResponse UpdateStudentActionExecution(int studentId, UpdateStudentDto updateData, int userId)
          {
               using var appDbContext = new AppDbContext();
               var student = appDbContext.Student.Find(studentId);
               if (student == null) return new StudentActionResponse { IsValid = false, Message = "Student not found." };

               var group = appDbContext.Group.Find(student.GroupId);
               if (group == null || group.UserId != userId)
                    return new StudentActionResponse { IsValid = false, Message = "Student not found." };

               student.FullName = updateData.FullName;
               student.Email = updateData.Email;
               student.PhoneNumber = updateData.PhoneNumber;
               appDbContext.SaveChanges();
               return new StudentActionResponse { IsValid = true, Message = "Student updated successfully." };
          }

          public StudentActionResponse GetStudentByIdActionExecution(int studentId, int userId)
          {
               using var appDbContext = new AppDbContext();
               var student = appDbContext.Student.Find(studentId);
               if (student == null) return new StudentActionResponse { IsValid = false, Message = "Student not found." };

               var group = appDbContext.Group.Find(student.GroupId);
               if (group == null || group.UserId != userId)
                    return new StudentActionResponse { IsValid = false, Message = "Student not found." };

               return new StudentActionResponse { IsValid = true, Message = "Student retrieved successfully.", Student = student };
          }

          public StudentActionResponse GetAllStudentsActionExecution(int userId)
          {
               using var appDbContext = new AppDbContext();
               var userGroupIds = appDbContext.Group
                    .Where(g => g.UserId == userId)
                    .Select(g => g.Id)
                    .ToHashSet();

               var students = appDbContext.Student
                    .Where(s => userGroupIds.Contains(s.GroupId))
                    .ToList();

               return new StudentActionResponse { IsValid = true, Message = "Students retrieved successfully.", Students = students };
          }
     }
}
