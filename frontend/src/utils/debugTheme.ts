/**
 * Debug Theme - Verifică starea temei din localStorage
 */

declare global {
  interface Window {
    debugTheme?: () => void;
  }
}

export const debugTheme = () => {
  const theme = localStorage.getItem('theme') || 'not set';
  const isDark = theme === 'dark';

  console.log('🔍 DEBUG THEME');
  console.log(`Theme in localStorage: ${theme}`);
  console.log(`Is dark mode: ${isDark}`);
  console.log(`System prefers dark: ${window.matchMedia('(prefers-color-scheme: dark)').matches}`);
};

window.debugTheme = debugTheme;
