using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.BusinessLayer.Structure;
using CatalogOnline.BusinessLayer.Core;
using System;
using System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CatalogOnline.BusinessLayer
{
     public class BusinessLogic
     {
          public IHealthAction GetHealth()
          {
               return new HealthService();
          }
          public IUserAction UserAction()
          {
               return new UserService(); // get from the structure folder
          }
          public IGradeAction GradeAction()
          {
               return new GradeService(); // get from the structure folder
          }
          public IGroupAction GroupAction()
          {
               return new GroupService();
          }
          public IStudentAction StudentAction()
          {
               return new StudentService();
          }
          public IAbsenceAction AbsenceAction()
          {
               return new AbsenceService();
          }
          public ISubjectAction SubjectAction()
          {
               return new SubjectService();
          }
          public ICalendarAction CalendarAction()
          {
               return new CalendarService();
          }
          public IEvaluationAction EvaluationAction()
          {
               return new EvaluationService();
          }
          public IAuthAction AuthAction()
          {
               return new AuthService();
          }
          public IJwtAction JwtAction()
          {
               return new JwtService();
          }
          public IReportAction ReportAction()
          {
               return new ReportService();
          }
          public ISettingsAction SettingsAction()
          {
               return new SettingsService();
          }
          public IDashboardAction DashboardAction()
          {
               return new DashboardService();
          }
          public IAdminAction AdminAction()
          {
               return new AdminService();
          }
     }
}