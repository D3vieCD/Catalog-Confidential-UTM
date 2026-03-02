import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paths } from '../../routes/paths';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { storage } from '../../utils';

/**
 * Sidebar - Navigare principală cu hover expand
 * Include meniu complet, logout cu modală și animații smooth
 */
// Definirea itemelor din meniu
const menuItems = [
  {
    id: 'home',
    label: 'Acasă',
    path: paths.dashboardRoutes.home,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
    ),
  },
  {
    id: 'students',
    label: 'Studenți',
    path: paths.dashboardRoutes.students,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
      </svg>
    ),
  },
  {
    id: 'groups',
    label: 'Grupe',
    path: paths.dashboardRoutes.groups,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
    ),
  },
  {
    id: 'catalog',
    label: 'Catalog',
    path: paths.dashboardRoutes.catalog,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
    ),
  },
  {
    id: 'reports',
    label: 'Rapoarte',
    path: paths.dashboardRoutes.reports,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m9-4h-6"/>
      </svg>
    ),
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: paths.dashboardRoutes.calendar,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Setări',
    path: paths.dashboardRoutes.settings,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
  },
];
/**
 * Componenta Sidebar principală
 * Include navigare completă, hover expand, dark mode și logout cu modală
 */
export const Sidebar = () => {
  // Utilizarea hook-urilor pentru navigare și locație
  const navigate = useNavigate();
  const location = useLocation();

  // Starea componentei
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Detectarea schimbărilor de dark mode
  useEffect(() => {
    const checkDark = () => {
      const hasDarkClass =
        document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark');
      setIsDark(hasDarkClass);
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Verifică dacă ruta este activă
  const isActive = (path: string) => location.pathname === path;
    /**
   * Deschide modală de confirmare logout
   */
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  /**
   * Confirmă logout-ul și navighează la login
   */
  const handleLogoutConfirm = () => {
    // Șterge datele din localStorage
    storage.clear();

    // Navighează la login
    navigate(paths.login);

    console.log('User logged out successfully');
  };
    return (
    <>
      <motion.aside
        animate={{ width: isExpanded ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 overflow-hidden z-20 shadow-lg"
        style={{ borderRadius: '0 24px 24px 0' }}
        onMouseEnter={() => {
          console.log('Mouse entered sidebar');
          setIsExpanded(true);
        }}
        onMouseLeave={() => {
          console.log('Mouse left sidebar');
          setIsExpanded(false);
        }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-center">
          <button
            onClick={() => navigate(paths.dashboardRoutes.home)}
            className="flex items-center gap-3 group transition-all duration-200 hover:scale-105 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Acasă"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
              </svg>
            </div>
            <motion.span
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-lg whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              style={{ color: isDark ? '#FFFFFF' : '#111827' }}
            >
              Academix
            </motion.span>
          </button>
        </div>