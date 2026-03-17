import { AppRoutes } from './routes/AppRoutes';
import './styles/animations.css';
import './utils/debugTheme';

/**
 * Extinde interfața Window pentru a include debugTheme
 */
declare global {
  interface Window {
    debugTheme?: () => void;
  }
}

/**
 * App Component - Entry point
 * Folosește React Router pentru navigare
 */

function App() {
  // Rulează debug theme la încărcare
  setTimeout(() => {
    if (window.debugTheme) {
      window.debugTheme();
    }
  }, 1000);
  
  return <AppRoutes />;
}

export default App;