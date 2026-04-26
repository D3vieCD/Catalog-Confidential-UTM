using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Models.Dashboard;
using CatalogOnline.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.BusinessLayer.Core
{
     public class DashboardActions
     {
          public DashboardActionResponse GetDashboardStatsActionExecution(int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var userGroupIds = appDbContext.Group
                         .Where(g => g.UserId == userId)
                         .Select(g => g.Id)
                         .ToHashSet();

                    var totalStudents = appDbContext.Student
                         .Where(s => userGroupIds.Contains(s.GroupId))
                         .Count();

                    var grades = appDbContext.Grade
                         .Where(g => userGroupIds.Contains(g.Student.GroupId))
                         .ToList();

                    var totalGrades = grades.Count;
                    var averageGrade = grades.Any() ? grades.Average(g => g.GradeValue) : 0;

                    var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

                    var totalAbsencesThisMonth = appDbContext.Absence
                         .Where(a => userGroupIds.Contains(a.Student.GroupId) && a.Date >= startOfMonth)
                         .Count();

                    return new DashboardActionResponse
                    {
                         IsValid = true,
                         Message = "Statistici recuperate cu succes.",
                         Stats = new DashboardStatsDto
                         {
                              TotalStudents = totalStudents,
                              TotalGrades = totalGrades,
                              AverageGrade = Math.Round(averageGrade, 2),
                              TotalAbsencesThisMonth = totalAbsencesThisMonth
                         }
                    };
               }
          }

          public DashboardActionResponse GetRecentActivityActionExecution(int userId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var userGroupIds = appDbContext.Group
                         .Where(g => g.UserId == userId)
                         .Select(g => g.Id)
                         .ToHashSet();

                    var recentGrades = appDbContext.Grade
                         .Where(g => userGroupIds.Contains(g.Student.GroupId))
                         .OrderByDescending(g => g.DateAwarded)
                         .Take(10)
                         .Select(g => new
                         {
                              g.Id,
                              StudentName = g.Student.FullName,
                              GradeValue = g.GradeValue,
                              GroupName = g.Student.Group.GroupName,
                              g.SubjectName,
                              g.DateAwarded
                         })
                         .ToList()
                         .Select(g => new RecentActivityDto
                         {
                              Id = g.Id,
                              StudentName = g.StudentName,
                              Action = "Notă adăugată: " + g.GradeValue,
                              Details = g.GroupName + " • " + g.SubjectName,
                              Time = GetRelativeTime(g.DateAwarded),
                              Type = "grade",
                              SortDate = g.DateAwarded
                         })
                         .ToList();

                    var recentAbsences = appDbContext.Absence
                         .Where(a => userGroupIds.Contains(a.Student.GroupId))
                         .OrderByDescending(a => a.Date)
                         .Take(10)
                         .Select(a => new
                         {
                              a.Id,
                              StudentName = a.Student.FullName,
                              a.IsMotivated,
                              GroupName = a.Student.Group.GroupName,
                              a.SubjectName,
                              a.Date
                         })
                         .ToList()
                         .Select(a => new RecentActivityDto
                         {
                              Id = a.Id,
                              StudentName = a.StudentName,
                              Action = a.IsMotivated ? "Absență motivată" : "Absență nemotivată",
                              Details = a.GroupName + " • " + a.SubjectName,
                              Time = GetRelativeTime(a.Date),
                              Type = "absence",
                              SortDate = a.Date
                         })
                         .ToList();

                    var allActivities = recentGrades
                         .Concat(recentAbsences)
                         .OrderByDescending(a => a.SortDate)
                         .Take(15)
                         .ToList();

                    return new DashboardActionResponse
                    {
                         IsValid = true,
                         Message = "Activitate recentă recuperată cu succes.",
                         RecentActivities = allActivities
                    };
               }
          }

          private static string GetRelativeTime(DateTime dateTime)
          {
               var diff = DateTime.UtcNow - dateTime;

               if (diff.TotalMinutes < 60)
                    return $"acum {(int)diff.TotalMinutes} min";
               if (diff.TotalHours < 24)
                    return $"acum {(int)diff.TotalHours} ore";
               if (diff.TotalDays < 2)
                    return "ieri";
               if (diff.TotalDays < 7)
                    return $"acum {(int)diff.TotalDays} zile";

               return dateTime.ToString("dd.MM.yyyy");
          }
     }
}
