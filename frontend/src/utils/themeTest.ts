/**
 * Theme Test - Verifică funcționalitatea temei
 */

declare global {
  interface Window {
    testTheme?: () => { theme: string; isDark: boolean };
  }
}

export const testTheme = () => {
  const theme = localStorage.getItem('theme') || 'not set';
  const isDark = theme === 'dark';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  console.log('🎨 Testing Theme...');
  console.log(`Current theme: ${theme}`);
  console.log(`Is dark: ${isDark}`);
  console.log(`System prefers dark: ${prefersDark}`);

  return { theme, isDark };
};

window.testTheme = testTheme;
