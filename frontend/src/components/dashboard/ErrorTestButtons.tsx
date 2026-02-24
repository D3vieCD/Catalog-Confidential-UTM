import React from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';

export const ErrorTestButtons: React.FC = () => {
  const navigate = useNavigate();

  const testErrorPages = [
    {
      id: '403',
      title: 'Test 403 - Forbidden',
      description: 'Acces interzis',
      color: 'from-orange-500 to-orange-600',
      route: paths.error.page403
    },
    {
      id: '404',
      title: 'Test 404 - Not Found',
      description: 'Pagina nu a fost găsită',
      color: 'from-blue-500 to-blue-600',
      route: paths.error.page404
    },
    {
      id: '500',
      title: 'Test 500 - Server Error',
      description: 'Eroare de server',
      color: 'from-red-500 to-red-600',
      route: paths.error.page500
    },
    {
      id: 'invalid',
      title: 'Test Invalid Route',
      description: 'Rută invalidă (wildcard)',
      color: 'from-purple-500 to-purple-600',
      route: '/pagina-inexistenta'
    }
  ];