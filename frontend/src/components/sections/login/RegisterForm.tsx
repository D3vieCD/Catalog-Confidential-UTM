import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '../../components/ui';
import { SocialLoginButton, Divider } from '../../components/auth';
import { storage } from '../../utils';
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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);
  const handleRegister = () => {
    setError('');
    setLoading(true);

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

    setTimeout(() => {
      storage.set('isRegistered', 'true');
      storage.set('userName', name);
      storage.set('userEmail', email);
      
      setLoading(false);
      navigate(paths.login);
    }, 1500);
  };
  return (
    <div 
      className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative min-h-screen transition-colors duration-300"
      style={{ backgroundColor: isDark ? '#111827' : '#FFFFFF' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-indigo-600 dark:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Creează cont!
            </h2>
          </div>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 transition-colors">
            Intră în comunitatea Academix
          </p>
        </div>