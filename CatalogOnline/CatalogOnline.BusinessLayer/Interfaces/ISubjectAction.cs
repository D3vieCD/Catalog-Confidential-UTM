using CatalogOnline.Domain.Models.Subject;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Interfaces
{
     public interface ISubjectAction
     {
          SubjectActionResponse CreateSubjectAction(CreateSubjectDto createData);
          SubjectActionResponse DeleteSubjectAction(int subjectId);
          SubjectActionResponse GetSubjectsByGroupIdAction(int groupId);
     }
}
