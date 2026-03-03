/**
 * Extinde interfața Window pentru a include testTheme
 */
declare global {
  interface Window {
    testTheme?: () => { testToggle: () => void };
  }
}
export const testTheme = () => {
  console.log('🎨 Testing Dark Mode Functionality...');
  
  // Verifică dacă elementul HTML are clasa 'dark'
  const hasDarkClass = document.documentElement.classList.contains('dark');
  console.log(`Current theme: ${hasDarkClass ? 'dark' : 'light'}`);
  
  // Verifică localStorage
  const savedTheme = localStorage.getItem('theme');
  console.log(`Saved theme in localStorage: ${savedTheme}`);
  
  // Verifică preferințele sistemului
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log(`System prefers dark: ${prefersDark}`);
  
  return { testToggle: () => {} }; // Placeholder pentru pasul următor
};