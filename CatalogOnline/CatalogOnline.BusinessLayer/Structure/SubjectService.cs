using CatalogOnline.BusinessLayer.Core;
using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.Domain.Models.Subject;
using CatalogOnline.Domain.Models.Responses;

namespace CatalogOnline.BusinessLayer.Structure
{
     public class SubjectService : SubjectActions, ISubjectAction
     {
          public SubjectActionResponse CreateSubjectAction(CreateSubjectDto createData)
          {
               return CreateSubjectActionExecution(createData);
          }
          public SubjectActionResponse DeleteSubjectAction(int subjectId)
          {
               return DeleteSubjectActionExecution(subjectId);
          }
          public SubjectActionResponse GetSubjectsByGroupIdAction(int groupId)
          {
               return GetSubjectsByGroupIdActionExecution(groupId);
          }
     }
}
