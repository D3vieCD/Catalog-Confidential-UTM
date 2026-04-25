import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import paths from '../../routes/paths';
import { motion } from 'framer-motion';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await login(credential, password);
      navigate(paths.dashboard);
    } catch (err: any) {
      setError(err.message || 'Email sau parolă incorectă!');
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-4 relative h-screen overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              Bun venit!
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
            Intră în cont pentru a accesa catalogul
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

        {/* Email / Username Input */}
        <div className="mb-3">
          <Input
            label="Email sau username"
            type="text"
            placeholder="profesor@scoala.ro"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            fullWidth
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <Input
            label="Parolă"
            type="password"
            placeholder="Introdu parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
            fullWidth
            disabled={loading}
          />
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between mb-4">
          <Checkbox label="Ține-mă minte" disabled={loading} />
          <motion.button
            onClick={() => console.log('Forgot password')}
            className="text-xs md:text-sm text-emerald-600 dark:text-emerald-400 font-medium relative inline-block"
            whileHover="hover"
            whileTap={{ y: 1 }}
          >
            <motion.span
              variants={{ hover: { y: -2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              Ai uitat parola?
            </motion.span>
            <motion.span
              className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 dark:bg-emerald-400 rounded-full"
              variants={{ hover: { width: '100%' } }}
              initial={{ width: '0%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </motion.button>
        </div>

        {/* Button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleLogin}
          loading={loading}
          disabled={!credential || !password}
        >
          Intră în cont
        </Button>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 transition-colors">
          Nu ai cont?{' '}
          <motion.button
            onClick={() => navigate(paths.register)}
            className="text-emerald-600 dark:text-emerald-400 font-semibold relative inline-block"
            whileHover="hover"
            whileTap={{ y: 1 }}
          >
            <motion.span
              variants={{ hover: { y: -2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              Înregistrează-te
            </motion.span>
            <motion.span
              className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 dark:bg-emerald-400 rounded-full"
              variants={{ hover: { width: '100%' } }}
              initial={{ width: '0%' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </motion.button>
        </p>
      </div>
    </div>
  );
};
