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