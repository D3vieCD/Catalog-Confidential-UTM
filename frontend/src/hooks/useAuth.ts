import { useNavigate } from 'react-router-dom';
import { MOCK_USERS } from '../_mock/mockUsers';
import { storage } from '../utils';
import { paths } from '../routes/paths';

/**
 * useAuth - Custom hook pentru autentificare
 * Centralizează toată logica de auth
 */

export const useAuth = () => {

  const navigate = useNavigate();
    const login = (email: string, password: string): string | null => {

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {

      storage.set('isLoggedIn', 'true');
      storage.set('userEmail', user.email);
      storage.set('userName', user.name);
      storage.set('userRole', user.role);
      storage.set('showAnimation', 'true');

      navigate(paths.dashboardRoutes.home);

      return null;
    }

    return 'Email sau parolă incorectă!';
  };
    const logout = () => {

    storage.clear();
    navigate(paths.auth.login);

  };
    const isAuthenticated = (): boolean => {

    return storage.get('isLoggedIn') === 'true';

  };
    const getUser = () => {

    return {
      name: storage.get('userName') || '',
      email: storage.get('userEmail') || '',
      role: storage.get('userRole') || '',
      avatar: storage.get('userAvatar') || '',
    };

  };
    const updateUser = (
    userData: {
      name?: string;
      email?: string;
      role?: string;
      avatar?: string;
    }
  ) => {

    if (userData.name)
      storage.set('userName', userData.name);

    if (userData.email)
      storage.set('userEmail', userData.email);

    if (userData.role)
      storage.set('userRole', userData.role);

    if (userData.avatar !== undefined)
      storage.set('userAvatar', userData.avatar);

  };
    return {

    login,
    logout,
    isAuthenticated,
    getUser,
    updateUser,

  };

};