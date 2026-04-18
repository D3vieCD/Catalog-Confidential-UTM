import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Users2, BookOpen, BarChart3, Calendar, Settings, Sparkles, LogOut } from 'lucide-react';
import  paths  from '../../routes/paths';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { storage } from '../../utils';

/**
 * Sidebar - Navigare principală cu hover expand
 * Include meniu complet, logout cu modală și animații smooth
 */

// Definirea itemelor din meniu
const menuItems = [
  { id: 'home',     label: 'Acasă',    path: paths.dashboardRoutes.home,     icon: <Home className="w-6 h-6" /> },
  { id: 'students', label: 'Studenți', path: paths.dashboardRoutes.students,  icon: <Users className="w-6 h-6" /> },
  { id: 'groups',   label: 'Grupe',    path: paths.dashboardRoutes.groups,    icon: <Users2 className="w-6 h-6" /> },
  { id: 'catalog',  label: 'Catalog',  path: paths.dashboardRoutes.catalog,   icon: <BookOpen className="w-6 h-6" /> },
  { id: 'reports',  label: 'Rapoarte', path: paths.dashboardRoutes.reports,   icon: <BarChart3 className="w-6 h-6" /> },
  { id: 'calendar', label: 'Calendar', path: paths.dashboardRoutes.calendar,  icon: <Calendar className="w-6 h-6" /> },
  { id: 'settings', label: 'Setări',   path: paths.dashboardRoutes.settings,  icon: <Settings className="w-6 h-6" /> },
];

/**
 * Componenta Sidebar principală
 * Include navigare completă, hover expand, dark mode și logout cu modală
 */
export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

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
        {/* Logo */}
        <div className="p-4 flex items-center justify-center">
          <button
            onClick={() => navigate(paths.dashboardRoutes.home)}
            className="flex items-center gap-3 group transition-all duration-200 hover:scale-105 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Acasă"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <motion.span
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-lg whitespace-nowrap text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
            >
              Academix
            </motion.span>
          </button>
        </div>

        {/* Meniu de Navigare */}
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
        </nav>

        {/* Buton de Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-4 px-3 py-3.5 rounded-xl font-medium transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            title={!isExpanded ? 'Deconectare' : ''}
          >
            <span className="flex-shrink-0">
              <LogOut className="w-6 h-6" />
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

      {/* Modală de Confirmare Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirmare Delogare"
        message="Ești sigur că vrei să te delogheze din Academix Catalogul Digital?"
        confirmText="Da, deloghează"
        cancelText="Anulează"
      />
    </>
  );
};
