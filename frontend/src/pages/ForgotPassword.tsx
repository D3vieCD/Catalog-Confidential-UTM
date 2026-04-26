import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Input, DarkModeToggle } from '../components/ui';
import { GradientBackground } from '../sections/login';
import { useAuth } from '../hooks/useAuth';
import paths from '../routes/paths';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!email) { setError('Introduceți adresa de email.'); return; }
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'A apărut o eroare.');
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row">
      <DarkModeToggle />
      <GradientBackground />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-4 relative h-screen overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => navigate(paths.login)}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Înapoi la autentificare
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Ai uitat parola?
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Introdu adresa de email și îți trimitem un link de resetare.
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-sm">Email trimis!</span>
              </div>
              <p className="text-sm">
                Dacă adresa <strong>{email}</strong> este asociată unui cont, vei primi un link de resetare în câteva momente.
              </p>
              <button
                onClick={() => navigate(paths.login)}
                className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Înapoi la autentificare →
              </button>
            </motion.div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="mb-4">
                <Input
                  label="Adresă de email"
                  type="email"
                  placeholder="profesor@scoala.ro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                  fullWidth
                  disabled={loading}
                />
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                loading={loading}
                disabled={!email}
              >
                Trimite link de resetare
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
