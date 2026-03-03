/**
 * Extinde interfața Window pentru a include debugTheme
 */
declare global {
  interface Window {
    debugTheme?: () => void;
  }
}