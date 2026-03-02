import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DarkModeToggle } from '../../components/ui';
import { paths } from '../../routes/paths';
import { useAuth } from '../../hooks/useAuth';

/**
 * Header - Bară de navigare superioară cu logo home, căutare și profil
 */
export const Header = () => {
      const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const currentUser = getUser();
    useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);