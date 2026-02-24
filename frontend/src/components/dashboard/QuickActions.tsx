import React from 'react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const navigate = useNavigate();

  const defaultActions: QuickAction[] = [
    {
      id: 'add-grade',
      title: 'Adaugă Notă',
      description: 'Înregistrează note noi pentru studenți',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      route: '/catalog/add-grade'
    },
    {
      id: 'add-absence',
      title: 'Înregistrează Absență',
      description: 'Marchează absențe pentru studenți',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      route: '/catalog/add-absence'
    },
    {
      id: 'generate-report',
      title: 'Generează Raport',
      description: 'Creează rapoarte pentru grupe sau studenți',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m9-4h-6"/>
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      route: '/reports'
    },
     {
      id: 'view-schedule',
      title: 'Vezi Orar',
      description: 'Accesează orarul complet',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      route: '/calendar'
    }
  ];
  const actionsToRender = actions || defaultActions;

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Acțiuni Rapide
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actionsToRender.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.route)}
            className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group"
          >
            <div className={`p-2.5 rounded-2xl bg-gradient-to-r ${action.color} text-white group-hover:scale-105 transition-transform duration-200`}>
              {action.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {action.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};