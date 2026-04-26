import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import paths from '../../routes/paths';
import { motion } from 'framer-motion';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!firstName || !lastName || !userName || !email || !password || !confirmPassword) {
      setError('Toate câmpurile sunt obligatorii!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Parolele nu se potrivesc!');
      return;
    }

    if (password.length < 8) {
      setError('Parola trebuie să aibă cel puțin 8 caractere!');
      return;
    }

    try {
      const result = await register({ userName, firstName, lastName, email, password, confirmPassword });
      setSuccess(true);
      setTimeout(() => navigate(`${paths.verifyEmail}?userId=${result.userId}`), 1000);
    } catch (err: any) {
      setError(err.message || 'Înregistrare eșuată!');
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-4 relative h-screen overflow-y-auto bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              Creează cont!
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
            Intră în comunitatea Academix
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-3 rounded-lg flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-3 p-3 rounded-lg flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Cont creat! Verifică emailul pentru cod...</span>
          </div>
        )}

        {/* Prenume + Nume */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <Input
            label="Prenume"
            type="text"
            placeholder="Ion"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            disabled={loading}
            className="py-2"
          />
          <Input
            label="Nume"
            type="text"
            placeholder="Popescu"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            disabled={loading}
            className="py-2"
          />
        </div>

        {/* Username */}
        <div className="mb-2">
          <Input
            label="Nume utilizator"
            type="text"
            placeholder="ionpopescu"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            fullWidth
            disabled={loading}
            className="py-2"
          />
        </div>

        {/* Email */}
        <div className="mb-2">
          <Input
            label="Email"
            type="email"
            placeholder="profesor@scoala.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            disabled={loading}
            className="py-2"
          />
        </div>

        {/* Parolă + Confirmă */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <Input
            label="Parolă"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            disabled={loading}
            className="py-2"
          />
          <Input
            label="Confirmă parola"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRegister();
            }}
            fullWidth
            disabled={loading}
            className="py-2"
          />
        </div>

        {/* Terms */}
        <div className="flex items-center mb-3">
          <Checkbox label="Sunt de acord cu termenii și condițiile" disabled={loading} />
        </div>

        {/* Button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleRegister}
          loading={loading}
          disabled={!firstName || !lastName || !userName || !email || !password || !confirmPassword}
        >
          Creează cont
        </Button>

        {/* Login */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 transition-colors">
          Ai deja cont?{' '}
          <motion.button
            onClick={() => navigate(paths.login)}
            className="text-emerald-600 dark:text-emerald-400 font-semibold relative inline-block"
            whileHover="hover"
            whileTap={{ y: 1 }}
          >
            <motion.span
              variants={{ hover: { y: -2 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              Intră în cont
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
