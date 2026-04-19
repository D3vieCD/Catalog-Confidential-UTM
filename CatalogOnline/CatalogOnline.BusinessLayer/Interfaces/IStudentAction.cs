using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Student;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IStudentAction
     {
          StudentActionResponse GetAllStudentsAction();
          StudentActionResponse GetStudentByIdAction(int id);
          StudentActionResponse CreateStudentAction(CreateStudentDto createData);
          StudentActionResponse UpdateStudentAction(int studentId, UpdateStudentDto studentData);
          StudentActionResponse DeleteStudentAction(int id);
     }
}
