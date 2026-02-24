import { useEffect } from 'react';

interface LoadingAnimationProps {
  onComplete: () => void;
}

/**
 * Loading Animation - Animație la intrare în Dashboard
 * Pălăria cade, apoi ecranul se ridică în sus
 */

export const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  useEffect(() => {
    // După 3 secunde (2s cap + 1s slide), finalizează
    const timer = setTimeout(() => {
      onComplete();
    }, 3100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center slide-up-curtain"
      style={{ zIndex: 9999 }}
    >
      <div className="text-center">
        {/* Pălăria de absolvent - animație de cădere */}
        <div className="graduation-cap-animation mb-8">
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
          <h2 className="text-4xl font-bold text-white mb-2">Bine ai venit! 🎓</h2>
          <p className="text-xl text-blue-100">Se încarcă dashboard-ul...</p>
        </div>

        {/* Spinner */}
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
};