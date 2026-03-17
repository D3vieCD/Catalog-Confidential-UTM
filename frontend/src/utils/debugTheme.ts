/**
 * Debug Theme - Test pentru a verifica dacă dark mode funcționează
 */

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

  // Verifică dacă elementele există
  const html = document.documentElement;
  const body = document.body;

  console.log('HTML element:', html);
  console.log('Body element:', body);

  // Verifică clasele curente
  console.log('HTML classes:', html.className);
  console.log('Body classes:', body.className);

  // Verifică computed styles
  const htmlBg = window.getComputedStyle(html).backgroundColor;
  const bodyBg = window.getComputedStyle(body).backgroundColor;

  console.log('HTML background:', htmlBg);
  console.log('Body background:', bodyBg);

  // Verifică dacă CSS custom este încărcat
  const testElement = document.createElement('div');
  testElement.className = 'bg-white dark:bg-gray-900';
  document.body.appendChild(testElement);

  const testBg = window.getComputedStyle(testElement).backgroundColor;
  console.log('Test element background:', testBg);

  document.body.removeChild(testElement);

  // Test toggle manual
  console.log('🔄 Testing manual toggle...');

  if (html.classList.contains('dark')) {
    console.log('Removing dark class...');
    html.classList.remove('dark');
    body.classList.remove('dark');
  } else {
    console.log('Adding dark class...');
    html.classList.add('dark');
    body.classList.add('dark');
  }

  setTimeout(() => {
    const newHtmlBg = window.getComputedStyle(html).backgroundColor;
    const newBodyBg = window.getComputedStyle(body).backgroundColor;

    console.log('After toggle - HTML background:', newHtmlBg);
    console.log('After toggle - Body background:', newBodyBg);

    console.log('🔍 DEBUG THEME END');
  }, 100);
};

// Export pentru a putea fi folosit în consolă
window.debugTheme = debugTheme;
