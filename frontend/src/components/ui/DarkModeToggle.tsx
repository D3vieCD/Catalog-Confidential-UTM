import { useEffect, useState } from 'react';
import { storage } from '../../utils';

/**
 * Props pentru componenta DarkModeToggle
 */
interface DarkModeToggleProps {
  variant?: 'fixed' | 'inline';
  className?: string;
}

/**
 * DarkModeToggle - Buton pentru schimbarea temei dark/light
 * Include detectare sistem, persistență și animații smooth
 */
export const DarkModeToggle = ({ variant = 'fixed', className = '' }: DarkModeToggleProps) => {
  const [isDark, setIsDark] = useState(false);

  /**
   * Aplică tema pe document (html și body)
   */
  const applyTheme = (dark: boolean) => {
    const html = document.documentElement;
    const body = document.body;

    if (dark) {
      html.classList.add('dark');
      body.classList.add('dark');
    } else {
      html.classList.remove('dark');
      body.classList.remove('dark');
    }
  };

  /**
   * Detectează tema inițială și aplică clasa corespunzătoare
   */
  useEffect(() => {
    // Verifică tema salvată în localStorage
    const savedTheme = storage.get('theme');

    // Verifică preferința sistemului
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determină tema inițială
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    // Aplică tema dacă este diferită de starea curentă
    if (shouldBeDark !== isDark) {
      setIsDark(shouldBeDark);
      applyTheme(shouldBeDark);
    }

    // FORȚARE APLICARE IMEDIATĂ LA LOGIN
    // Asigură că tema se aplică corect la încărcarea paginii
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Schimbă tema între dark și light
   */
  const toggleDarkMode = () => {
    const newDarkState = !isDark;

    // Aplică noua temă
    applyTheme(newDarkState);

    // Salvează preferința în localStorage
    storage.set('theme', newDarkState ? 'dark' : 'light');

    // Actualizează starea locală
    setIsDark(newDarkState);

    // Debug log
    console.log('Dark mode:', newDarkState ? 'ON' : 'OFF');
  };

  // Clase de bază și variante
  const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border-2";
  const variantClasses = variant === 'fixed'
    ? 'fixed top-6 right-6 z-50 shadow-lg'
    : 'p-2 hover:bg-gray-100 border-0';

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{
        backgroundColor: variant === 'fixed'
          ? (isDark ? '#374151' : '#FFFFFF')
          : 'transparent',
        borderColor: variant === 'fixed'
          ? (isDark ? '#4B5563' : '#E5E7EB')
          : 'transparent',
      }}
      aria-label="Toggle Dark Mode"
    >
      {/* Iconă pentru dark mode (soare) */}
      {isDark ? (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        /* Iconă pentru light mode (lună) */
        <svg
          className="w-5 h-5 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};
