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