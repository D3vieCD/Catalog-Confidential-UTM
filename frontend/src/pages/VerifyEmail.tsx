import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, DarkModeToggle } from '../components/ui';
import { GradientBackground } from '../sections/login';
import { useAuth } from '../hooks/useAuth';
import paths from '../routes/paths';

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, resendVerification, loading } = useAuth();
  const userId = parseInt(searchParams.get('userId') || '0');

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!userId) navigate(paths.login, { replace: true });
    inputRefs.current[0]?.focus();
  }, [userId, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < 6) { setError('Introdu toate cele 6 cifre.'); return; }
    setError('');
    try {
      await verifyEmail(userId, code);
      setSuccess(true);
      setTimeout(() => navigate(paths.login), 2000);
    } catch (err: any) {
      setError(err.message || 'Cod invalid.');
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification(userId);
      setResendCooldown(60);
      setError('');
    } catch (err: any) {
      setError(err.message || 'A apărut o eroare.');
    }
  };

  const code = digits.join('');

  return (
    <div className="h-screen overflow-hidden flex flex-col lg:flex-row">
      <DarkModeToggle />
      <GradientBackground />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-4 relative h-screen overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Verifică emailul
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Am trimis un cod de 6 cifre pe adresa ta de email.<br />Introdu-l mai jos pentru a-ți activa contul.
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-center"
            >
              <svg className="w-10 h-10 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">Email verificat cu succes!</p>
              <p className="text-sm mt-1">Te redirecționăm la autentificare...</p>
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

              {/* Code inputs */}
              <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-colors"
                  />
                ))}
              </div>

              <Button
                variant="primary"
                fullWidth
                onClick={handleVerify}
                loading={loading}
                disabled={code.length < 6}
              >
                Verifică codul
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Nu ai primit codul?{' '}
                {resendCooldown > 0 ? (
                  <span className="text-gray-400">Retrimite în {resendCooldown}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline disabled:opacity-50"
                  >
                    Retrimite codul
                  </button>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
