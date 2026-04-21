using CatalogOnline.BusinessLayer.Interfaces;
using CatalogOnline.BusinessLayer.Structure;
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
            return new UserService();
        }
        public IGradeAction GradeAction()
        {
            return new GradeService();
        }
        public IGroupAction GroupAction()
        {
            return new GroupService();
        }
        public IStudentAction StudentAction()
        {
            return new StudentService();
        }
        public ICalendarAction CalendarAction()
        {
            return new CalendarService();
        }
    }
}