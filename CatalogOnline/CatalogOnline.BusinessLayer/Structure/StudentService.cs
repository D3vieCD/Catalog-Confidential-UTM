using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Student;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.BusinessLayer.Structure
{
    public class StudentService:StudentActions, IStudentAction
     {
          public StudentActionResponse CreateStudentAction(CreateStudentDto createData)
          {
               return CreateStudentActionExecution(createData);
          }
          public StudentActionResponse   DeleteStudentAction(int id)
          {
               return DeleteStudentActionExecution(id);
          }
          public StudentActionResponse UpdateStudentAction(int studentId, UpdateStudentDto studentData)
          {
               return UpdateStudentActionExecution(studentId, studentData);
          }
          public StudentActionResponse GetAllStudentsAction()
          {
               return GetAllStudentsActionExecution();
          }
          public StudentActionResponse GetStudentByIdAction(int id)
          {
               return GetStudentByIdActionExecution(id);
          }
     }
}
