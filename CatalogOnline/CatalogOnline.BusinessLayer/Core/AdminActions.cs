using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Models.Admin;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Core
{
     public class AdminActions
     {
          public AdminActionResponse GetAdminStatsActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var totalUsers = appDbContext.User.Count();
                    var totalStudents = appDbContext.Student.Count();
                    var totalGroups = appDbContext.Group.Count();

                    var gradeValues = appDbContext.Grade.Select(g => g.GradeValue).ToList();
                    var globalAverage = gradeValues.Any() ? Math.Round(gradeValues.Average(), 1) : 0;

                    return new AdminActionResponse
                    {
                         IsValid = true,
                         Message = "Statistici recuperate cu succes.",
                         Stats = new AdminStatsDto
                         {
                              TotalUsers = totalUsers,
                              TotalStudents = totalStudents,
                              TotalGroups = totalGroups,
                              GlobalAverage = globalAverage
                         }
                    };
               }
          }

          public AdminActionResponse GetAdminActivityActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var recentGrades = appDbContext.Grade
                         .OrderByDescending(g => g.DateAwarded)
                         .Take(10)
                         .Select(g => new
                         {
                              g.Id,
                              StudentName = g.Student.FullName,
                              g.GradeValue,
                              g.SubjectName,
                              g.DateAwarded
                         })
                         .ToList()
                         .Select(g => new
                         {
                              Dto = new AdminActivityDto
                              {
                                   Id = g.Id,
                                   Action = "Notă adăugată",
                                   Target = g.StudentName + " — " + g.SubjectName + " (" + g.GradeValue + ")",
                                   Timestamp = g.DateAwarded.ToString("dd.MM.yyyy HH:mm"),
                                   Type = "create"
                              },
                              SortDate = g.DateAwarded
                         });

                    var recentAbsences = appDbContext.Absence
                         .OrderByDescending(a => a.Date)
                         .Take(10)
                         .Select(a => new
                         {
                              a.Id,
                              StudentName = a.Student.FullName,
                              a.SubjectName,
                              a.IsMotivated,
                              a.Date
                         })
                         .ToList()
                         .Select(a => new
                         {
                              Dto = new AdminActivityDto
                              {
                                   Id = a.Id,
                                   Action = a.IsMotivated ? "Absență motivată" : "Absență nemotivată",
                                   Target = a.StudentName + " — " + a.SubjectName,
                                   Timestamp = a.Date.ToString("dd.MM.yyyy HH:mm"),
                                   Type = "create"
                              },
                              SortDate = a.Date
                         });

                    var recentUsers = appDbContext.User
                         .OrderByDescending(u => u.CreatedOn)
                         .Take(5)
                         .Select(u => new
                         {
                              u.Id,
                              u.FirstName,
                              u.LastName,
                              u.CreatedOn
                         })
                         .ToList()
                         .Select(u => new
                         {
                              Dto = new AdminActivityDto
                              {
                                   Id = u.Id,
                                   Action = "Utilizator creat",
                                   Target = u.FirstName + " " + u.LastName,
                                   Timestamp = u.CreatedOn.ToString("dd.MM.yyyy HH:mm"),
                                   Type = "create"
                              },
                              SortDate = u.CreatedOn
                         });

                    var activities = recentGrades
                         .Concat(recentAbsences)
                         .Concat(recentUsers)
                         .OrderByDescending(x => x.SortDate)
                         .Take(15)
                         .Select(x => x.Dto)
                         .ToList();

                    return new AdminActionResponse
                    {
                         IsValid = true,
                         Message = "Activitate recuperată cu succes.",
                         Activities = activities
                    };
               }
          }
     }
}
