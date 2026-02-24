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
  const handleTestError = (route: string) => {
    navigate(route);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Testare Pagini de Eroare
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {testErrorPages.map((test) => (
          <button
            key={test.id}
            onClick={() => handleTestError(test.route)}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${test.color} text-white group-hover:scale-105 transition-transform duration-200`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {test.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {test.description}
                </p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Notă:</strong> Aceste butoane sunt doar pentru testare. În producție, paginile de eroare vor fi afișate automat în caz de erori reale.
        </p>
      </div>
    </div>
  );
};