import React from 'react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, availableThemes, currentThemeConfig } = useTheme();

  return React.createElement('div', {
    className: 'relative'
  }, [
    // Theme button
    React.createElement('button', {
      onClick: () => {
        const currentIndex = availableThemes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        setTheme(availableThemes[nextIndex]);
      },
      className: 'p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2',
      title: 'Schimbă tema'
    }, [
      React.createElement('svg', {
        className: 'w-4 h-4 text-gray-600 dark:text-gray-400',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
      }, React.createElement('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M7 21a4 4 0 01-4-4V5a4 4 0 014 4h16a4 4 0 014 4v12a4 4 0 01-4 4z'
      })),
      React.createElement('span', {
        className: 'text-sm font-medium text-gray-900 dark:text-white'
      }, currentThemeConfig.name)
    ]),

    // Theme dropdown
    React.createElement('div', {
      className: 'absolute right-0 top-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 z-50'
    }, [
      React.createElement('div', { className: 'space-y-1 min-w-[160px]' },
        ...availableThemes.map((themeType) => {
          const config = {
            default: { name: 'Default', primary: '#3b82f6' },
            dark: { name: 'Dark', primary: '#8b5cf6' },
            blue: { name: 'Blue Ocean', primary: '#0ea5e9' },
            green: { name: 'Forest Green', primary: '#10b981' },
            purple: { name: 'Royal Purple', primary: '#8b5cf6' }
          }[themeType];

          return React.createElement('button', {
            key: themeType,
            onClick: () => setTheme(themeType),
            className: `
              w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2
              ${theme === themeType
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `
          }, [
            React.createElement('div', {
              className: 'w-3 h-3 rounded-full',
              style: { backgroundColor: config.primary }
            }),
            React.createElement('span', { className: 'text-sm' }, config.name)
          ]);
        })
      )
    ])
  ]);
};
