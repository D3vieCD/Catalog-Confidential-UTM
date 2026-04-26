import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Input, DarkModeToggle } from '../components/ui';
import { GradientBackground } from '../sections/login';
import { useAuth } from '../hooks/useAuth';
import paths from '../routes/paths';

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, loading } = useAuth();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate(paths.login, { replace: true });
    }
  }, [token, navigate]);

  const handleReset = async () => {
    setError('');
    if (newPassword.length < 6) { setError('Parola trebuie să aibă cel puțin 6 caractere.'); return; }
    if (newPassword !== confirmPassword) { setError('Parolele nu coincid.'); return; }
    try {
      await resetPassword(token, newPassword, confirmPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'A apărut o eroare.');
    }
  };

  const EyeIcon = ({ show }: { show: boolean }) => show ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row">
      <DarkModeToggle />
      <GradientBackground />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-4 relative h-screen overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Resetare parolă
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Introdu noua parolă pentru contul tău.
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-sm">Parolă resetată cu succes!</span>
              </div>
              <p className="text-sm">Te poți autentifica acum cu noua parolă.</p>
              <button
                onClick={() => navigate(paths.login)}
                className="mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Mergi la autentificare →
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

              <div className="mb-3 relative">
                <Input
                  label="Parolă nouă"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Minim 6 caractere"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  <EyeIcon show={showPwd} />
                </button>
              </div>

              <div className="mb-4 relative">
                <Input
                  label="Confirmă parola"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repetă parola nouă"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleReset(); }}
                  fullWidth
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  tabIndex={-1}
                >
                  <EyeIcon show={showConfirm} />
                </button>
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleReset}
                loading={loading}
                disabled={!newPassword || !confirmPassword}
              >
                Resetează parola
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                <button
                  onClick={() => navigate(paths.login)}
                  className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                >
                  Înapoi la autentificare
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
