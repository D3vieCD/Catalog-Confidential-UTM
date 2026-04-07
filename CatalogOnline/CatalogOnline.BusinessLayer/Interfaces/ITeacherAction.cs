using CatalogOnline.Domain.Entities.Teacher;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Teacher;
using System.Collections.Generic;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface ITeacherAction
     {
          //List<TeacherData> GetAllTeachersAction();
          //TeacherData GetTeacherByIdAction(int id);
          DefaultActionResponse CreateUserAction(CreateTeacherDto createData);
          //void UpdateUserAction(TeacherData teacher);
          //void DeleteUserAction(int id);
     }
}