using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Student;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IStudentAction
     {
          StudentActionResponse GetAllStudentsAction(int userId);
          StudentActionResponse GetStudentByIdAction(int id, int userId);
          StudentActionResponse CreateStudentAction(CreateStudentDto createData, int userId);
          StudentActionResponse UpdateStudentAction(int studentId, UpdateStudentDto studentData, int userId);
          StudentActionResponse DeleteStudentAction(int id, int userId);
     }
}
