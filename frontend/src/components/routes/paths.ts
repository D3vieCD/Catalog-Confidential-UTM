/**
 * Application Routes Paths
 */

const paths = {
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',

  auth: {
    login: '/login',
  },

  dashboardRoutes: {
    home: '/dashboard',
    students: '/dashboard/students',
    groups: '/dashboard/groups',
    catalog: '/dashboard/catalog',
    reports: '/dashboard/reports',
    calendar: '/dashboard/calendar',
    settings: '/dashboard/settings',
    activity: '/dashboard/activity',
  },

  error: {
    page403: '/403',
    page404: '/404',
    page500: '/500',
  },
};

export default paths;