import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Register, Dashboard, Calendar, Settings, Students, Groups, Catalog, GroupCatalog, Reports } from '../pages';
import { Page403, Page404, Page500 } from '../pages/error';
import { DashboardLayout } from '../layouts/dashboard/DashboardLayout';
import { storage } from '../utils';
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
        <Route path="/" element={<Navigate to={paths.login} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
<Route 
  path={paths.login} 
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  } 
/>

<Route 
  path={paths.register} 
  element={
    <PublicRoute>
      <Register />
    </PublicRoute>
  } 
/>
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