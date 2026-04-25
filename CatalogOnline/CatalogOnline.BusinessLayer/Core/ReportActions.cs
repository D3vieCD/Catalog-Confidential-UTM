using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Report;
using CatalogOnline.Domain.Models.Report;
using CatalogOnline.Domain.Models.Responses;
using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.BusinessLayer.Core
{
     public class ReportActions
     {
          public ReportActionResponse GenerateReportActionExecution(GenerateReportDto generateData, int userId)
          {
               using var appDbContext = new AppDbContext();

               var group = appDbContext.Group
                    .Include(g => g.Students)
                         .ThenInclude(s => s.Grades)
                    .Include(g => g.Students)
                         .ThenInclude(s => s.Absences)
                    .FirstOrDefault(g => g.Id == generateData.GroupId && g.UserId == userId);

               if (group == null)
                    return new ReportActionResponse { IsValid = false, Message = "Grupa nu a fost găsită sau nu îți aparține." };

               var students = generateData.StudentId.HasValue
                    ? group.Students.Where(s => s.Id == generateData.StudentId.Value).ToList()
                    : group.Students.ToList();

               if (generateData.StudentId.HasValue && students.Count == 0)
                    return new ReportActionResponse { IsValid = false, Message = "Studentul nu a fost găsit în această grupă." };

               byte[] fileData;
               string contentType;
               string fileName;

               if (generateData.Format.ToUpper() == "PDF")
               {
                    return new ReportActionResponse { IsValid = false, Message = "Formatul PDF nu este suportat momentan. Folosiți XLSX." };
               }

               using (var workbook = new XLWorkbook())
               {
                    var infoSheet = workbook.Worksheets.Add("Informații Grupă");
                    infoSheet.Cell(1, 1).Value = "Grupă";
                    infoSheet.Cell(1, 2).Value = group.GroupName ?? "-";
                    infoSheet.Cell(2, 1).Value = "Specializare";
                    infoSheet.Cell(2, 2).Value = group.Specialization ?? "-";
                    infoSheet.Cell(3, 1).Value = "Facultate";
                    infoSheet.Cell(3, 2).Value = group.Faculty ?? "-";
                    infoSheet.Cell(4, 1).Value = "Coordonator";
                    infoSheet.Cell(4, 2).Value = group.Coordinator ?? "-";
                    infoSheet.Cell(5, 1).Value = "An";
                    infoSheet.Cell(5, 2).Value = group.Year;
                    infoSheet.Cell(6, 1).Value = "Semestru";
                    infoSheet.Cell(6, 2).Value = group.Semester;
                    infoSheet.Cell(7, 1).Value = "Data generării";
                    infoSheet.Cell(7, 2).Value = DateTime.Now.ToString("dd.MM.yyyy HH:mm");

                    var labelStyle = infoSheet.Range("A1:A7").Style;
                    labelStyle.Font.Bold = true;
                    infoSheet.Columns().AdjustToContents();

                    if (generateData.ReportType == "Note" || generateData.ReportType == "Complet")
                    {
                         var gradeSheet = workbook.Worksheets.Add("Note");
                         gradeSheet.Cell(1, 1).Value = "Student";
                         gradeSheet.Cell(1, 2).Value = "Materie";
                         gradeSheet.Cell(1, 3).Value = "Notă";
                         gradeSheet.Cell(1, 4).Value = "Data";

                         var headerRange = gradeSheet.Range("A1:D1");
                         headerRange.Style.Font.Bold = true;
                         headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#22c55e");
                         headerRange.Style.Font.FontColor = XLColor.White;

                         int row = 2;
                         foreach (var student in students)
                         {
                              foreach (var grade in student.Grades)
                              {
                                   gradeSheet.Cell(row, 1).Value = student.FullName;
                                   gradeSheet.Cell(row, 2).Value = grade.SubjectName;
                                   gradeSheet.Cell(row, 3).Value = grade.GradeValue;
                                   gradeSheet.Cell(row, 4).Value = grade.DateAwarded.ToString("dd.MM.yyyy");
                                   row++;
                              }
                         }
                         gradeSheet.Columns().AdjustToContents();
                    }

                    if (generateData.ReportType == "Absente" || generateData.ReportType == "Complet")
                    {
                         var absenceSheet = workbook.Worksheets.Add("Absențe");
                         absenceSheet.Cell(1, 1).Value = "Student";
                         absenceSheet.Cell(1, 2).Value = "Materie";
                         absenceSheet.Cell(1, 3).Value = "Data";
                         absenceSheet.Cell(1, 4).Value = "Motivată";

                         var headerRange = absenceSheet.Range("A1:D1");
                         headerRange.Style.Font.Bold = true;
                         headerRange.Style.Fill.BackgroundColor = XLColor.FromHtml("#22c55e");
                         headerRange.Style.Font.FontColor = XLColor.White;

                         int row = 2;
                         foreach (var student in students)
                         {
                              foreach (var absence in student.Absences)
                              {
                                   absenceSheet.Cell(row, 1).Value = student.FullName;
                                   absenceSheet.Cell(row, 2).Value = absence.SubjectName;
                                   absenceSheet.Cell(row, 3).Value = absence.Date.ToString("dd.MM.yyyy");
                                   absenceSheet.Cell(row, 4).Value = absence.IsMotivated ? "Da" : "Nu";
                                   row++;
                              }
                         }
                         absenceSheet.Columns().AdjustToContents();
                    }

                    using var stream = new MemoryStream();
                    workbook.SaveAs(stream);
                    fileData = stream.ToArray();
               }

               contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
               var studentSuffix = generateData.StudentId.HasValue
                    ? $"_{students.FirstOrDefault()?.FullName?.Replace(" ", "_") ?? "student"}"
                    : "_toata_grupa";
               fileName = $"Raport_{group.GroupName}_{generateData.ReportType}{studentSuffix}_{DateTime.Now:yyyyMMdd_HHmm}.xlsx";

               var report = new ReportData
               {
                    UserId = userId,
                    GroupId = generateData.GroupId,
                    StudentId = generateData.StudentId,
                    ReportType = generateData.ReportType,
                    Format = "XLSX",
                    FileName = fileName,
                    FileData = fileData,
                    GeneratedAt = DateTime.UtcNow
               };
               appDbContext.Report.Add(report);
               appDbContext.SaveChanges();

               return new ReportActionResponse
               {
                    IsValid = true,
                    Message = "Raport generat cu succes.",
                    FileData = fileData,
                    FileName = fileName,
                    ContentType = contentType
               };
          }

          public ReportActionResponse GetReportHistoryActionExecution(int userId)
          {
               using var appDbContext = new AppDbContext();

               var reports = appDbContext.Report
                    .Include(r => r.Group)
                    .Include(r => r.Student)
                    .Where(r => r.UserId == userId)
                    .OrderByDescending(r => r.GeneratedAt)
                    .Select(r => new ReportHistoryItemDto
                    {
                         Id = r.Id,
                         GroupName = r.Group.GroupName ?? "-",
                         StudentName = r.Student != null ? r.Student.FullName : null,
                         ReportType = r.ReportType,
                         Format = r.Format,
                         FileName = r.FileName,
                         GeneratedAt = r.GeneratedAt
                    })
                    .ToList();

               return new ReportActionResponse
               {
                    IsValid = true,
                    Message = "Istoric rapoarte recuperat cu succes.",
                    Reports = reports
               };
          }

          public ReportActionResponse GetReportStatsActionExecution(int userId)
          {
               using var appDbContext = new AppDbContext();

               var now = DateTime.UtcNow;
               var startOfMonth = new DateTime(now.Year, now.Month, 1);

               var totalReports = appDbContext.Report.Count(r => r.UserId == userId);
               var activeGroups = appDbContext.Group.Count(g => g.UserId == userId);
               var exportsThisMonth = appDbContext.Report
                    .Count(r => r.UserId == userId && r.GeneratedAt >= startOfMonth);
               var importsThisMonth = appDbContext.ImportLog
                    .Count(i => i.UserId == userId && i.ImportedAt >= startOfMonth);

               return new ReportActionResponse
               {
                    IsValid = true,
                    Message = "Statistici recuperate cu succes.",
                    Stats = new ReportStatsDto
                    {
                         TotalReports = totalReports,
                         ActiveGroups = activeGroups,
                         ExportsThisMonth = exportsThisMonth,
                         ImportsThisMonth = importsThisMonth
                    }
               };
          }

          public ReportActionResponse LogImportActionExecution(LogImportDto logData, int userId)
          {
               using var appDbContext = new AppDbContext();

               var group = appDbContext.Group.FirstOrDefault(g => g.Id == logData.GroupId && g.UserId == userId);
               if (group == null)
                    return new ReportActionResponse { IsValid = false, Message = "Grupa nu a fost găsită." };

               var importLog = new ImportLogData
               {
                    UserId = userId,
                    GroupId = logData.GroupId,
                    StudentCount = logData.StudentCount,
                    ImportedAt = DateTime.UtcNow
               };
               appDbContext.ImportLog.Add(importLog);
               appDbContext.SaveChanges();

               return new ReportActionResponse { IsValid = true, Message = "Import înregistrat cu succes." };
          }

          public ReportActionResponse DownloadReportActionExecution(int reportId, int userId)
          {
               using var appDbContext = new AppDbContext();

               var report = appDbContext.Report.FirstOrDefault(r => r.Id == reportId && r.UserId == userId);
               if (report == null)
                    return new ReportActionResponse { IsValid = false, Message = "Raportul nu a fost găsit." };

               return new ReportActionResponse
               {
                    IsValid = true,
                    Message = "Raport descărcat cu succes.",
                    FileData = report.FileData,
                    FileName = report.FileName,
                    ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
               };
          }
     }
}
