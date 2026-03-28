import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '../../ui';
import { SocialLoginButton, Divider } from '../../auth';
import { storage } from '../../../utils';
import { paths } from '../../routes/paths';

/**
 * Register Form - Formularul de înregistrare
 * RESPONSIVE: Full width pe mobile, 1/2 pe desktop
 */

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setError('');
    setLoading(true);

    // Validări
    if (!name || !email || !password || !confirmPassword) {
      setError('Toate câmpurile sunt obligatorii!');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc!');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Parola trebuie să aibă cel puțin 6 caractere!');
      setLoading(false);
      return;
    }

    // Simulare înregistrare reușită
    // Aici ar trebui să faci call la API
    setTimeout(() => {
      // Salvăm datele (simulare)
      storage.set('isRegistered', 'true');
      storage.set('userName', name);
      storage.set('userEmail', email);

      setLoading(false);
      // Redirecționăm la login
      navigate(paths.login);
    }, 1500);
  };

  return (
  <div
    className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
  >


      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-emerald-600 dark:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              Creează cont!
            </h2>
          </div>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 transition-colors">
            Intră în comunitatea Academix
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Name Input */}
        <div className="mb-4">
          <Input
            label="Nume complet"
            type="text"
            placeholder="Ion Popescu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            disabled={loading}
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            placeholder="profesor@scoala.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <Input
            label="Parolă"
            type="password"
            placeholder="Introdu parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            disabled={loading}
          />
        </div>

        {/* Confirm Password Input */}
        <div className="mb-4">
          <Input
            label="Confirmă parola"
            type="password"
            placeholder="Reintrodu parola"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRegister();
            }}
            fullWidth
            disabled={loading}
          />
        </div>

        {/* Terms & Privacy */}
        <div className="flex items-center mb-5">
          <Checkbox label="Sunt de acord cu termenii și condițiile" disabled={loading} />
        </div>

        {/* Button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleRegister}
          loading={loading}
          disabled={!name || !email || !password || !confirmPassword}
        >
          Creează cont
        </Button>

        {/* Divider */}
        <Divider />

        {/* Social Buttons */}
        <div className="space-y-3">
          <SocialLoginButton provider="google" fullWidth />
          <SocialLoginButton provider="microsoft" fullWidth />
          <SocialLoginButton provider="github" fullWidth />
        </div>

        {/* Login */}
        <p className="text-center text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-6 transition-colors">
          Ai deja cont?{' '}
          <button
            onClick={() => navigate(paths.login)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors"
          >
            Intră în cont
          </button>
        </p>
      </div>
    </div>
  );
};
