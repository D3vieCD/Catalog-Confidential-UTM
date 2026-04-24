using CatalogOnline.DataAccess.Context;
using CatalogOnline.Domain.Entities.Evaluation;
using CatalogOnline.Domain.Models.Evaluation;
using CatalogOnline.Domain.Models.Responses;
using Microsoft.EntityFrameworkCore;

namespace CatalogOnline.BusinessLayer.Core
{
     public class EvaluationActions
     {
          public EvaluationActionResponse CreateEvaluationActionExecution(CreateEvaluationDto createData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var evaluation = new EvaluationData
                    {
                         SubjectId = createData.SubjectId,
                         Name = createData.Name,
                         Type = createData.Type,
                         Date = createData.Date
                    };
                    appDbContext.Evaluation.Add(evaluation);
                    appDbContext.SaveChanges();
                    return new EvaluationActionResponse
                    {
                         IsValid = true,
                         Message = "Evaluation created successfully.",
                         Evaluation = evaluation
                    };
               }
          }

          public EvaluationActionResponse DeleteEvaluationActionExecution(int evaluationId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var evaluation = appDbContext.Evaluation
                         .Include(e => e.Grades)
                         .Include(e => e.Absences)
                         .FirstOrDefault(e => e.Id == evaluationId);

                    if (evaluation == null)
                         return new EvaluationActionResponse { IsValid = false, Message = "Evaluation not found." };

                    appDbContext.Grade.RemoveRange(evaluation.Grades);
                    appDbContext.Absence.RemoveRange(evaluation.Absences);
                    appDbContext.Evaluation.Remove(evaluation);
                    appDbContext.SaveChanges();

                    return new EvaluationActionResponse { IsValid = true, Message = "Evaluation deleted successfully." };
               }
          }

          public EvaluationActionResponse UpdateEvaluationActionExecution(int evaluationId, UpdateEvaluationDto updateData)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var evaluation = appDbContext.Evaluation.Find(evaluationId);
                    if (evaluation == null)
                         return new EvaluationActionResponse { IsValid = false, Message = "Evaluation not found." };

                    evaluation.Name = updateData.Name;
                    evaluation.Type = updateData.Type;
                    evaluation.Date = updateData.Date;
                    appDbContext.SaveChanges();

                    return new EvaluationActionResponse
                    {
                         IsValid = true,
                         Message = "Evaluation updated successfully.",
                         Evaluation = evaluation
                    };
               }
          }

          public EvaluationActionResponse GetEvaluationByIdActionExecution(int evaluationId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var evaluation = appDbContext.Evaluation.Find(evaluationId);
                    return new EvaluationActionResponse
                    {
                         IsValid = evaluation != null,
                         Message = evaluation != null ? "Evaluation retrieved successfully." : "Evaluation not found.",
                         Evaluation = evaluation
                    };
               }
          }

          public EvaluationActionResponse GetAllEvaluationsActionExecution()
          {
               using (var appDbContext = new AppDbContext())
               {
                    var evaluations = appDbContext.Evaluation.ToList();
                    return new EvaluationActionResponse
                    {
                         IsValid = true,
                         Message = "Evaluations retrieved successfully.",
                         Evaluations = evaluations
                    };
               }
          }

          public EvaluationActionResponse GetEvaluationsBySubjectIdActionExecution(int subjectId)
          {
               using (var appDbContext = new AppDbContext())
               {
                    var evaluations = appDbContext.Evaluation
                         .Where(e => e.SubjectId == subjectId)
                         .OrderBy(e => e.Date)
                         .ToList();

                    return new EvaluationActionResponse
                    {
                         IsValid = true,
                         Message = "Evaluations retrieved successfully.",
                         Evaluations = evaluations
                    };
               }
          }
     }
}
