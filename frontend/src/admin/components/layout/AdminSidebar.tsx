import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paths } from '../../../routes/paths';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { storage } from '../../../utils';

/**
 * AdminSidebar - Navigare panou admin
 * Același stil ca Sidebar profesor, badge ADMIN în header
 */

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: paths.adminRoutes.home,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5zm-10 3a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
      </svg>
    ),
  },
  {
    id: 'users',
    label: 'Utilizatori',
    path: paths.adminRoutes.users,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    id: 'groups',
    label: 'Grupe',
    path: paths.adminRoutes.groups,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'students',
    label: 'Studenți',
    path: paths.adminRoutes.students,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Setări Sistem',
    path: paths.adminRoutes.settings,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogoutConfirm = () => {
    storage.clear();
    navigate(paths.login);
  };

  return (
    <>
      <motion.aside
        animate={{ width: isExpanded ? 280 : 80 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 overflow-hidden z-20 shadow-lg"
        style={{ borderRadius: '0 24px 24px 0' }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo + ADMIN badge */}
        <div className="p-4 flex items-center justify-center">
          <button
            onClick={() => navigate(paths.adminRoutes.home)}
            className="flex items-center gap-3 group transition-all duration-200 hover:scale-105 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Admin Dashboard"
          >
            <div className="relative w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] font-bold px-1 rounded-full leading-tight">
                ADM
              </span>
            </div>
            <div className="flex flex-col items-start">
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-base whitespace-nowrap text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight"
              >
                Academix
              </motion.span>
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap uppercase tracking-widest leading-tight"
              >
                Admin Panel
              </motion.span>
            </div>
          </button>
        </div>

        {/* Meniu navigare */}
        <nav className="flex-1 p-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={!isExpanded ? item.label : ''}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <motion.span
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  width: isExpanded ? 'auto' : 0,
                  x: isExpanded ? 0 : -10,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </button>
          ))}

          {/* Separator + link la dashboard profesor */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(paths.dashboard)}
              className="w-full flex items-center gap-4 px-3 py-3.5 rounded-xl font-medium transition-all duration-200 text-gray-400 dark:text-gray-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400"
              title={!isExpanded ? 'Dashboard Profesor' : ''}
            >
              <span className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </span>
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-sm"
              >
                Dashboard Profesor
              </motion.span>
            </button>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-4 px-3 py-3.5 rounded-xl font-medium transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            title={!isExpanded ? 'Deconectare' : ''}
          >
            <span className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </span>
            <motion.span
              animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              Deconectare
            </motion.span>
          </button>
        </div>
      </motion.aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirmare Delogare"
        message="Ești sigur că vrei să te delogheze din panoul Admin?"
        confirmText="Da, deloghează"
        cancelText="Anulează"
      />
    </>
  );
};
