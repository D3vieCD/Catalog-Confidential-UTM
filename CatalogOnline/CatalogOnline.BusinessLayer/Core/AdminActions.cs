using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Models.Admin;
using CatalogOnline.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

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

          public AdminActionResponse GetAdminActivityActionExecution(int? userId = null)
          {
               using (var appDbContext = new AppDbContext())
               {
                    IEnumerable<(AdminActivityDto Dto, DateTime SortDate)> all;

                    if (userId.HasValue)
                    {
                         // ── Per-user: toată activitatea legată de grupele acelui utilizator ──
                         var groupIds = appDbContext.Group
                              .Where(g => g.UserId == userId.Value)
                              .Select(g => g.Id)
                              .ToList();

                         var studentIds = appDbContext.Student
                              .Where(s => groupIds.Contains(s.GroupId))
                              .Select(s => s.Id)
                              .ToList();

                         var grades = appDbContext.Grade
                              .Where(g => studentIds.Contains(g.StudentId))
                              .OrderByDescending(g => g.DateAwarded)
                              .Select(g => new { g.Id, StudentName = g.Student.FullName, g.GradeValue, g.SubjectName, g.DateAwarded })
                              .ToList()
                              .Select(g => (
                                   Dto: new AdminActivityDto { Id = g.Id, Action = "Notă adăugată", Target = g.StudentName + " — " + g.SubjectName + " (" + g.GradeValue + ")", Timestamp = g.DateAwarded.ToString("dd.MM.yyyy HH:mm"), Type = "grade" },
                                   SortDate: g.DateAwarded));

                         var absences = appDbContext.Absence
                              .Where(a => studentIds.Contains(a.StudentId))
                              .OrderByDescending(a => a.Date)
                              .Select(a => new { a.Id, StudentName = a.Student.FullName, a.SubjectName, a.IsMotivated, a.Date })
                              .ToList()
                              .Select(a => (
                                   Dto: new AdminActivityDto { Id = a.Id, Action = a.IsMotivated ? "Absență motivată" : "Absență nemotivată", Target = a.StudentName + " — " + a.SubjectName, Timestamp = a.Date.ToString("dd.MM.yyyy HH:mm"), Type = "absence" },
                                   SortDate: a.Date));

                         var students = appDbContext.Student
                              .Where(s => groupIds.Contains(s.GroupId))
                              .OrderByDescending(s => s.CreatedOn)
                              .Select(s => new { s.Id, s.FullName, GroupName = s.Group.GroupName, s.CreatedOn })
                              .ToList()
                              .Select(s => (
                                   Dto: new AdminActivityDto { Id = s.Id, Action = "Student adăugat", Target = s.FullName + " — " + s.GroupName, Timestamp = s.CreatedOn.ToString("dd.MM.yyyy HH:mm"), Type = "student" },
                                   SortDate: s.CreatedOn));

                         var imports = appDbContext.ImportLog
                              .Where(i => i.UserId == userId.Value)
                              .OrderByDescending(i => i.ImportedAt)
                              .Select(i => new { i.Id, GroupName = i.Group.GroupName, i.StudentCount, i.ImportedAt })
                              .ToList()
                              .Select(i => (
                                   Dto: new AdminActivityDto { Id = i.Id, Action = "Import studenți", Target = i.GroupName + " (" + i.StudentCount + " studenți)", Timestamp = i.ImportedAt.ToString("dd.MM.yyyy HH:mm"), Type = "import" },
                                   SortDate: i.ImportedAt));

                         all = grades.Concat(absences).Concat(students).Concat(imports);
                    }
                    else
                    {
                         // ── Global: ultimele 2 zile, toți utilizatorii ──
                         var cutoff = DateTime.Now.AddDays(-2);

                         var grades = appDbContext.Grade
                              .Where(g => g.DateAwarded >= cutoff)
                              .OrderByDescending(g => g.DateAwarded)
                              .Select(g => new { g.Id, StudentName = g.Student.FullName, g.GradeValue, g.SubjectName, g.DateAwarded })
                              .ToList()
                              .Select(g => (
                                   Dto: new AdminActivityDto { Id = g.Id, Action = "Notă adăugată", Target = g.StudentName + " — " + g.SubjectName + " (" + g.GradeValue + ")", Timestamp = g.DateAwarded.ToString("dd.MM.yyyy HH:mm"), Type = "grade" },
                                   SortDate: g.DateAwarded));

                         var absences = appDbContext.Absence
                              .Where(a => a.Date >= cutoff)
                              .OrderByDescending(a => a.Date)
                              .Select(a => new { a.Id, StudentName = a.Student.FullName, a.SubjectName, a.IsMotivated, a.Date })
                              .ToList()
                              .Select(a => (
                                   Dto: new AdminActivityDto { Id = a.Id, Action = a.IsMotivated ? "Absență motivată" : "Absență nemotivată", Target = a.StudentName + " — " + a.SubjectName, Timestamp = a.Date.ToString("dd.MM.yyyy HH:mm"), Type = "absence" },
                                   SortDate: a.Date));

                         var users = appDbContext.User
                              .Where(u => u.CreatedOn >= cutoff)
                              .OrderByDescending(u => u.CreatedOn)
                              .Select(u => new { u.Id, u.FirstName, u.LastName, u.CreatedOn })
                              .ToList()
                              .Select(u => (
                                   Dto: new AdminActivityDto { Id = u.Id, Action = "Utilizator creat", Target = u.FirstName + " " + u.LastName, Timestamp = u.CreatedOn.ToString("dd.MM.yyyy HH:mm"), Type = "user" },
                                   SortDate: u.CreatedOn));

                         var students = appDbContext.Student
                              .Where(s => s.CreatedOn >= cutoff)
                              .OrderByDescending(s => s.CreatedOn)
                              .Select(s => new { s.Id, s.FullName, GroupName = s.Group.GroupName, s.CreatedOn })
                              .ToList()
                              .Select(s => (
                                   Dto: new AdminActivityDto { Id = s.Id, Action = "Student adăugat", Target = s.FullName + " — " + s.GroupName, Timestamp = s.CreatedOn.ToString("dd.MM.yyyy HH:mm"), Type = "student" },
                                   SortDate: s.CreatedOn));

                         all = grades.Concat(absences).Concat(users).Concat(students);
                    }

                    var activities = all
                         .OrderByDescending(x => x.SortDate)
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

          public AdminActionResponse GetAdminGroupsActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var groups = appDbContext.Group
                         .Include(g => g.Students)
                              .ThenInclude(s => s.Grades)
                         .Include(g => g.Students)
                              .ThenInclude(s => s.Absences)
                         .ToList();

                    var dtos = groups.Select(g =>
                    {
                         var allGrades = g.Students.SelectMany(s => s.Grades).Select(gr => gr.GradeValue).ToList();
                         var avg = allGrades.Any() ? Math.Round(allGrades.Average(), 1) : 0;
                         var absences = g.Students.Sum(s => s.Absences.Count);

                         return new AdminGroupDto
                         {
                              Id = g.Id,
                              GroupName = g.GroupName ?? string.Empty,
                              Coordinator = g.Coordinator ?? string.Empty,
                              Faculty = g.Faculty ?? string.Empty,
                              Year = g.Year,
                              StudentCount = g.Students.Count,
                              Average = avg,
                              Absences = absences,
                              IsArchived = g.IsArchived
                         };
                    }).ToList();

                    return new AdminActionResponse
                    {
                         IsValid = true,
                         Message = "Grupe recuperate cu succes.",
                         Groups = dtos
                    };
               }
          }

          public AdminActionResponse GetAdminStudentsActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var students = appDbContext.Student
                         .Include(s => s.Group)
                         .Include(s => s.Grades)
                         .Include(s => s.Absences)
                         .ToList();

                    var dtos = students.Select(s =>
                    {
                         var grades = s.Grades.Select(g => g.GradeValue).ToList();
                         var avg = grades.Any() ? Math.Round(grades.Average(), 1) : 0;

                         return new AdminStudentDto
                         {
                              Id = s.Id,
                              FullName = s.FullName,
                              Email = s.Email,
                              GroupName = s.Group?.GroupName ?? string.Empty,
                              Faculty = s.Group?.Faculty ?? string.Empty,
                              Year = s.Group?.Year ?? 0,
                              Average = avg,
                              Absences = s.Absences.Count
                         };
                    }).ToList();

                    return new AdminActionResponse
                    {
                         IsValid = true,
                         Message = "Studenți recuperați cu succes.",
                         Students = dtos
                    };
               }
          }

          public AdminActionResponse ResetUserDataActionExecution(int targetUserId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var groupIds = appDbContext.Group
                         .Where(g => g.UserId == targetUserId)
                         .Select(g => g.Id)
                         .ToList();

                    if (!groupIds.Any())
                         return new AdminActionResponse { IsValid = true, Message = "Utilizatorul nu are date de șters." };

                    var studentIds = appDbContext.Student
                         .Where(s => groupIds.Contains(s.GroupId))
                         .Select(s => s.Id)
                         .ToList();

                    var subjectIds = appDbContext.Subject
                         .Where(s => groupIds.Contains(s.GroupId))
                         .Select(s => s.Id)
                         .ToList();

                    var evaluationIds = appDbContext.Evaluation
                         .Where(e => subjectIds.Contains(e.SubjectId))
                         .Select(e => e.Id)
                         .ToList();

                    // 1. Note și absențe (FK la Student și Evaluation — NoAction, deci ștergem explicit)
                    appDbContext.Grade.RemoveRange(
                         appDbContext.Grade.Where(g => studentIds.Contains(g.StudentId)));
                    appDbContext.Absence.RemoveRange(
                         appDbContext.Absence.Where(a => studentIds.Contains(a.StudentId)));
                    appDbContext.SaveChanges();

                    // 2. Evaluări
                    appDbContext.Evaluation.RemoveRange(
                         appDbContext.Evaluation.Where(e => evaluationIds.Contains(e.Id)));
                    appDbContext.SaveChanges();

                    // 3. Materii, Studenți, Grupe
                    appDbContext.Subject.RemoveRange(
                         appDbContext.Subject.Where(s => groupIds.Contains(s.GroupId)));
                    appDbContext.Student.RemoveRange(
                         appDbContext.Student.Where(s => groupIds.Contains(s.GroupId)));
                    appDbContext.Group.RemoveRange(
                         appDbContext.Group.Where(g => groupIds.Contains(g.Id)));
                    appDbContext.SaveChanges();

                    return new AdminActionResponse
                    {
                         IsValid = true,
                         Message = $"Datele utilizatorului au fost șterse ({groupIds.Count} grupe)."
                    };
               }
          }

          public AdminActionResponse ArchiveAdminGroupActionExecution(int groupId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var group = appDbContext.Group.FirstOrDefault(g => g.Id == groupId);
                    if (group == null)
                         return new AdminActionResponse { IsValid = false, Message = "Grupa nu a fost găsită." };

                    group.IsArchived = !group.IsArchived;
                    appDbContext.SaveChanges();

                    return new AdminActionResponse { IsValid = true, Message = "Status grupă actualizat." };
               }
          }
     }
}
