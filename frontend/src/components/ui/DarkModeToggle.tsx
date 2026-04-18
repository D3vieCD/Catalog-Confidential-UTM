import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface DarkModeToggleProps {
  variant?: 'fixed' | 'inline';
  className?: string;
}

export const DarkModeToggle = ({ variant = 'fixed', className = '' }: DarkModeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();

  const baseClasses = 'w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200';
  const variantClasses =
    variant === 'fixed'
      ? 'fixed top-6 right-6 z-50 shadow-lg border-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${baseClasses} ${variantClasses} ${className}`}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-emerald-600" />
      )}
    </button>
  );
};
