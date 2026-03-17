import { AnimatedElements } from './AnimatedElements';

/**
 * Gradient Background - Partea stângă a login page
 * RESPONSIVE: Ascuns pe mobile (<1024px), vizibil pe desktop
 */

export const GradientBackground = () => {
  return (
    <div className="hidden lg:flex gradient-bg w-full lg:w-1/2 min-h-screen items-center justify-center relative overflow-hidden transition-colors duration-300">

      {/* Elemente animate în fundal */}
      <AnimatedElements />

      {/* Logo și text central */}
      <div className="text-center text-white z-10 px-8 relative">
        <div className="floating-icon inline-block mb-8">
          <svg className="w-24 h-24 md:w-32 md:h-32 text-white opacity-90" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path>
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Academix</h1>

        <p className="subtitle-text text-lg md:text-xl text-blue-100 transition-colors duration-300 max-w-md mx-auto">
          Platforma ta digitală pentru gestionarea catalogului școlar
        </p>
      </div>
    </div>
  );
};
