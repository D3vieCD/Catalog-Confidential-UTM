using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Teacher;
using CatalogOnline.Domain.Models.Responses;
using CatalogOnline.Domain.Models.Teacher;
using Microsoft.EntityFrameworkCore.Storage.Json;
using System;
using System.Collections.Generic;

namespace CatalogOnline.BusinessLayer.Core
{
     public class TeacherActions
     {
          public DefaultActionResponse CreateUserActionExecution(CreateTeacherDto createData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var teacher = new TeacherData
                    {
                         UserName = createData.UserName,
                         Password = createData.Password,
                         Email = createData.Email,
                         FirstName = createData.FirstName,
                         LastName = createData.LastName,
                    };
                    appDbContext.Teachers.Add(teacher);
                    appDbContext.SaveChanges();
                    return new DefaultActionResponse
                    {
                         IsValid = true,
                         Message = "Teacher created successfully."
                    };

               }
          }
     }
}