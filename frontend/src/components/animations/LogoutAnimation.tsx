import { useEffect } from 'react';

interface LogoutAnimationProps {
  onComplete: () => void;
}

/**
 * Logout Animation - Animație la ieșire din Dashboard
 * Ecranul coboară, pălăria zboară în sus
 */

export const LogoutAnimation = ({ onComplete }: LogoutAnimationProps) => {
  useEffect(() => {
    // După 2.8 secunde, finalizează
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center slide-down-curtain"
      style={{ zIndex: 9999 }}
    >
      <div className="text-center">
        {/* Pălăria dispare în sus */}
        <div className="graduation-cap-leave mb-8">
          <svg 
            className="w-32 h-32 mx-auto text-white"
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
        </div>

        {/* Text animat */}
        <div className="fade-in-text">
          <h2 className="text-4xl font-bold text-white mb-2">La revedere! 👋</h2>
          <p className="text-xl text-blue-100">Te deconectăm...</p>
        </div>

        {/* Spinner */}
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
};