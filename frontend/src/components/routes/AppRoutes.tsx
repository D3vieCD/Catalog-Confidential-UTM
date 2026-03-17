import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register, Dashboard, Calendar, Settings, Students, Groups, Catalog, GroupCatalog, Reports } from '../../pages';
import { Page403, Page404, Page500 } from '../../pages/error';
import { DashboardLayout } from '../../layouts/dashboard/DashboardLayout';
import { storage } from '../../utils';
import { paths } from './paths';

/**
 * Protected Route - Verifică dacă user-ul e autentificat
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = storage.get('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return <Navigate to={paths.login} replace />;
  }

  return <>{children}</>;
};

/**
 * Public Route - Redirect la dashboard dacă e deja logat
 */
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = storage.get('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return <Navigate to={paths.dashboard} replace />;
  }

  return <>{children}</>;
};

/**
 * App Routes - Toate rutele aplicației
 */
export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root la login */}
        <Route path="/" element={<Navigate to={paths.login} replace />} />

        {/* Login Page */}
        <Route
          path={paths.login}
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Register Page */}
        <Route
          path={paths.register}
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Dashboard Page - Protejat */}
        <Route
          path={paths.dashboard}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Calendar Page - Protejat */}
        <Route
          path={paths.dashboardRoutes.calendar}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Calendar />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Students Page - Protejat */}
        <Route
          path={paths.dashboardRoutes.students}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Students />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Groups Page - Protejat */}
        <Route
          path={paths.dashboardRoutes.groups}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Groups />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catalog Page - Protejat */}
        <Route
          path={paths.dashboardRoutes.catalog}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Catalog />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Group Catalog Page - Protejat */}
        <Route
          path="/dashboard/catalog/:groupId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <GroupCatalog />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Reports Page - Protejat */}
        <Route
          path={paths.dashboardRoutes.reports}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings Page - Protejat */}
        <Route
          path={paths.dashboardRoutes.settings}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Error Pages - 404 e public, restul protejate */}
        <Route
          path={paths.error.page403}
          element={
            <ProtectedRoute>
              <Page403 />
            </ProtectedRoute>
          }
        />
        <Route path={paths.error.page404} element={<Page404 />} />
        <Route
          path={paths.error.page500}
          element={
            <ProtectedRoute>
              <Page500 />
            </ProtectedRoute>
          }
        />

        {/* 404 - Not Found - Public */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
};
