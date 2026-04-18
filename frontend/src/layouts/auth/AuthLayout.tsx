import { Navigate } from 'react-router-dom';
import { storage } from '../../utils';
import  paths  from '../../routes/paths';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * AuthLayout - Layout pentru paginile de autentificare
 * Dacă userul e deja logat, îl redirecționează la dashboard
 */

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const isLoggedIn = storage.get('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return <Navigate to={paths.dashboardRoutes.home} replace />;
  }

  return <>{children}</>;

};
