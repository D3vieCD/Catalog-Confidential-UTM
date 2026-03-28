/**
 * Application Routes Paths
 */

export const paths = {
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
  },

  admin: '/admin',

  adminRoutes: {
    home: '/admin',
    users: '/admin/users',
    groups: '/admin/groups',
    students: '/admin/students',
    settings: '/admin/settings',
  },

  error: {
    page403: '/403',
    page404: '/404',
    page500: '/500',
  },
};
