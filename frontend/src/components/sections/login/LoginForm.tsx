import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Checkbox } from '../../components/ui';
import { SocialLoginButton, Divider } from '../../components/auth';
import { MOCK_USERS } from '../../_mock/mockUsers';
import { storage } from '../../utils';
import { paths } from '../../routes/paths';

/**
 * Login Form - Formularul de autentificare
 * RESPONSIVE: Full width pe mobile, 1/2 pe desktop
 */
export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
  const handleLogin = () => {
    setError('');
    setLoading(true);

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      storage.set('isLoggedIn', 'true');
      storage.set('userEmail', email);
      storage.set('userName', user.name);
      storage.set('showAnimation', 'true');
      
      navigate('/dashboard');
    } else {
      setError('Email sau parolă incorectă!');
      setLoading(false);
    }
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bun venit!
            </h2>
          </div>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 transition-colors">
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
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
            fullWidth
            disabled={loading}
          />
        </div>