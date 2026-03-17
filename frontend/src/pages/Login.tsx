import { GradientBackground, LoginForm } from '../sections/login';
import { DarkModeToggle } from '../components/ui';

/**
 * Login Page - Pagina de autentificare
 * RESPONSIVE:
 * - Mobile: Doar LoginForm (full width)
 * - Desktop: Split screen (GradientBackground + LoginForm)
 */

export const Login = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Dark Mode Toggle - Fixed în colțul din dreapta-sus */}
      <DarkModeToggle />

      {/* Gradient Background - ASCUNS pe mobile, vizibil pe desktop */}
      <GradientBackground />

      {/* Login Form - FULL WIDTH pe mobile, 1/2 pe desktop */}
      <LoginForm />
    </div>
  );
};
