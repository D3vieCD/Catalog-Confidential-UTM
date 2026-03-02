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