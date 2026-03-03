import { GradientBackground, RegisterForm } from '../sections/login';
import { DarkModeToggle } from '../components/ui';

/**
 * Register Page - Pagina de înregistrare
 * RESPONSIVE: 
 * - Mobile: Doar RegisterForm (full width)
 * - Desktop: Split screen (GradientBackground + RegisterForm)
 */

export const Register = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Dark Mode Toggle - Fixed în colțul din dreapta-sus */}
      <DarkModeToggle />
      
      {/* Gradient Background - ASCUNS pe mobile, vizibil pe desktop */}
      <GradientBackground />
      
      {/* Register Form - FULL WIDTH pe mobile, 1/2 pe desktop */}
      <RegisterForm />
    </div>
  );
};