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