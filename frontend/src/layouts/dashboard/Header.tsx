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
    const goToHome = () => {
    navigate(paths.dashboard);
  };
    return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 z-30 shadow-sm"
    >
      <div className="flex items-center justify-between h-full px-6"></div>
              {/* Logo Home Button */}
        <button
          onClick={goToHome}
          className="flex items-center gap-3 p-2 rounded-2xl hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          title="Acasă"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="font-bold text-lg whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
            style={{ color: isDark ? '#FFFFFF' : '#111827' }}
          >
            Academix Catalogul Digital
          </motion.span>
        </button>