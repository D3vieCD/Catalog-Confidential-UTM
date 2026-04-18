import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, Users2, GraduationCap, Settings, ShieldCheck, ArrowLeft, LogOut } from 'lucide-react';
import paths from '../../../routes/paths';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { storage } from '../../../utils';

/**
 * AdminSidebar - Navigare panou admin
 * Același stil ca Sidebar profesor, badge ADMIN în header
 */

const menuItems = [
  { id: 'dashboard', label: 'Dashboard',    path: paths.adminRoutes.home,     icon: <LayoutGrid className="w-6 h-6" /> },
  { id: 'users',     label: 'Utilizatori',  path: paths.adminRoutes.users,    icon: <Users className="w-6 h-6" /> },
  { id: 'groups',    label: 'Grupe',        path: paths.adminRoutes.groups,   icon: <Users2 className="w-6 h-6" /> },
  { id: 'students',  label: 'Studenți',     path: paths.adminRoutes.students, icon: <GraduationCap className="w-6 h-6" /> },
  { id: 'settings',  label: 'Setări Sistem',path: paths.adminRoutes.settings, icon: <Settings className="w-6 h-6" /> },
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
              <ShieldCheck className="w-7 h-7 text-white" />
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
                <ArrowLeft className="w-6 h-6" />
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
