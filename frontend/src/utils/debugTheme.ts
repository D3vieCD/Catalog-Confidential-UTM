/**
 * Extinde interfața Window pentru a include debugTheme
 */
declare global {
  interface Window {
    debugTheme?: () => void;
  }
}
export const debugTheme = () => {
  console.log('🔍 DEBUG THEME START');
  
  const html = document.documentElement;
  const body = document.body;
  
  console.log('HTML element:', html);
  console.log('Body element:', body);
  console.log('HTML classes:', html.className);
  console.log('Body classes:', body.className);
};
// În interiorul debugTheme:
  const htmlBg = window.getComputedStyle(html).backgroundColor;
  const bodyBg = window.getComputedStyle(body).backgroundColor;
  
  console.log('HTML background:', htmlBg);
  console.log('Body background:', bodyBg);
  // În interiorul debugTheme:
  const testElement = document.createElement('div');
  testElement.className = 'bg-white dark:bg-gray-900';
  document.body.appendChild(testElement);
  
  const testBg = window.getComputedStyle(testElement).backgroundColor;
  console.log('Test element background:', testBg);
  
  document.body.removeChild(testElement);