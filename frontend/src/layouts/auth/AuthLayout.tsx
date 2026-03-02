import { Navigate } from 'react-router-dom';
import { storage } from '../../utils';
import { paths } from '../../routes/paths';

interface AuthLayoutProps {
  children: React.ReactNode;
}


export const AuthLayout = ({ children }: AuthLayoutProps) => {

  const isLoggedIn = storage.get('isLoggedIn') === 'true';
    if (isLoggedIn) {

    return <Navigate to={paths.dashboardRoutes.home} replace />;

  }