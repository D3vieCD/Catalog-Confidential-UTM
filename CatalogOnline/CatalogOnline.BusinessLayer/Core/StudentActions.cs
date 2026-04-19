using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Students;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Student;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.BusinessLayer.Core
{
     public class StudentActions
     {
          public StudentActionResponse CreateStudentActionExecution(CreateStudentDto createData)

          {
               using (var appDbContext = new AppDbContext())
               {
                    var student = new StudentData
                    {
                         FullName = createData.FullName,
                         Email = createData.Email,
                         PhoneNumber = createData.PhoneNumber,

                    };
                    appDbContext.Student.Add(student);
                    appDbContext.SaveChanges();
                    return new StudentActionResponse
                    {
                         IsValid = true,
                         Message = "Student created successfully."
                    };

               }
          }

          public StudentActionResponse DeleteStudentActionExecution(int studentId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var student = appDbContext.Student.Find(studentId);
                    if (student == null)
                    {
                         return new StudentActionResponse
                         {
                              IsValid = false,
                              Message = "Student not found."
                         };
                    }
                    appDbContext.Student.Remove(student);
                    appDbContext.SaveChanges();
                    return new StudentActionResponse
                    {
                         IsValid = true,
                         Message = "Student deleted successfully."
                    };
               }

          }
          public StudentActionResponse UpdateStudentActionExecution(int studentId, UpdateStudentDto updateData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var student = appDbContext.Student.Find(studentId);
                    if (student == null)
                    {
                         return new StudentActionResponse
                         {
                              IsValid = false,
                              Message = "Student not found."
                         };
                    }
                    student.FullName = updateData.FullName;
                    student.Email = updateData.Email;
                    student.PhoneNumber = updateData.PhoneNumber;
                    appDbContext.SaveChanges();
                    return new StudentActionResponse
                    {
                         IsValid = true,
                         Message = "Student updated successfully."
                    };
               }
          }
          public StudentActionResponse GetStudentByIdActionExecution(int studentId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var student = appDbContext.Student.Find(studentId);
                    return new StudentActionResponse
                    {
                         IsValid = student != null,
                         Message = student != null ? "Student retrieved successfully." : "Student not found.",
                         Student = student
                    };
               }
          }
          public StudentActionResponse GetAllStudentsActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var students = appDbContext.Student.ToList();
                    return new StudentActionResponse
                    {
                         IsValid = true,
                         Message = "Students retrieved successfully.",
                         Students = students
                    };
               }
          }
     }
}
