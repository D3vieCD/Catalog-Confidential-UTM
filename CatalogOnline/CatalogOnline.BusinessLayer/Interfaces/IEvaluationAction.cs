using CatalogOnline.Domain.Models.Evaluation;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface IEvaluationAction
     {
          EvaluationActionResponse GetAllEvaluationsAction();
          EvaluationActionResponse GetEvaluationByIdAction(int id);
          EvaluationActionResponse GetEvaluationsBySubjectIdAction(int subjectId);
          EvaluationActionResponse CreateEvaluationAction(CreateEvaluationDto createData);
          EvaluationActionResponse UpdateEvaluationAction(int evaluationId, UpdateEvaluationDto updateData);
          EvaluationActionResponse DeleteEvaluationAction(int id);
     }
}
