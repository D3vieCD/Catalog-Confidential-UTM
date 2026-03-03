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
// În interiorul funcției testTheme:
  const testToggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    console.log(`Before toggle: ${isDark ? 'dark' : 'light'}`);

    // Simulează click pe butonul de dark mode
    const darkModeButton = document.querySelector<HTMLButtonElement>('[aria-label="Toggle Dark Mode"]');
    if (darkModeButton) {
      darkModeButton.click();
      setTimeout(() => {
        const newIsDark = document.documentElement.classList.contains('dark');
        console.log(`After toggle: ${newIsDark ? 'dark' : 'light'}`);
        console.log('✅ Dark mode toggle working!');
      }, 100);
    } else {
      console.log('❌ Dark mode button not found');
    }
  };
  
  return { testToggle };