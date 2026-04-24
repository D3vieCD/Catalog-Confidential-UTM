using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Evaluation;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class EvaluationService : EvaluationActions, IEvaluationAction
     {
          public EvaluationActionResponse CreateEvaluationAction(CreateEvaluationDto createData)
          {
               return CreateEvaluationActionExecution(createData);
          }
          public EvaluationActionResponse DeleteEvaluationAction(int id)
          {
               return DeleteEvaluationActionExecution(id);
          }
          public EvaluationActionResponse UpdateEvaluationAction(int evaluationId, UpdateEvaluationDto updateData)
          {
               return UpdateEvaluationActionExecution(evaluationId, updateData);
          }
          public EvaluationActionResponse GetAllEvaluationsAction()
          {
               return GetAllEvaluationsActionExecution();
          }
          public EvaluationActionResponse GetEvaluationByIdAction(int id)
          {
               return GetEvaluationByIdActionExecution(id);
          }
          public EvaluationActionResponse GetEvaluationsBySubjectIdAction(int subjectId)
          {
               return GetEvaluationsBySubjectIdActionExecution(subjectId);
          }
     }
}
