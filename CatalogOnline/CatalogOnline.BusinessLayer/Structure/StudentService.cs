using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Student;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class StudentService : StudentActions, IStudentAction
     {
          public StudentActionResponse CreateStudentAction(CreateStudentDto createData, int userId)
          {
               return CreateStudentActionExecution(createData, userId);
          }
          public StudentActionResponse DeleteStudentAction(int id, int userId)
          {
               return DeleteStudentActionExecution(id, userId);
          }
          public StudentActionResponse UpdateStudentAction(int studentId, UpdateStudentDto studentData, int userId)
          {
               return UpdateStudentActionExecution(studentId, studentData, userId);
          }
          public StudentActionResponse GetAllStudentsAction(int userId)
          {
               return GetAllStudentsActionExecution(userId);
          }
          public StudentActionResponse GetStudentByIdAction(int id, int userId)
          {
               return GetStudentByIdActionExecution(id, userId);
          }
     }
}
