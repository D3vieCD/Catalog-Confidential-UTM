/**
 * Extinde interfața Window pentru a include testTheme
 */
declare global {
  interface Window {
    testTheme?: () => { testToggle: () => void };
  }
}