import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { DarkModeToggle } from '../../../components/ui';
import paths from '../../../routes/paths';
import { useAuth } from '../../../hooks/useAuth';

/**
 * AdminHeader - Header panou admin cu badge "Admin Panel"
 */
export const AdminHeader = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const currentUser = getUser();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300 z-30 shadow-sm"
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo + Admin Badge */}
        <button
          onClick={() => navigate(paths.adminRoutes.home)}
          className="flex items-center gap-3 p-2 rounded-2xl hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
          title="Admin Dashboard"
        >
          <div className="relative w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-base text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
              Academix
            </span>
            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-tight">
              Admin Panel
            </span>
          </div>
        </button>

        {/* Titlu pagina curentă */}
        <div className="hidden md:flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            Panou Administrare
          </span>
        </div>

        {/* Dreapta: user + dark mode */}
        <div className="flex items-center gap-3">
          {/* Avatar + nume */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {currentUser?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {currentUser?.name ?? 'Administrator'}
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium leading-tight">
                Administrator
              </span>
            </div>
          </div>

          {/* Dark mode toggle — separat, după nume */}
          <DarkModeToggle variant="inline" />
        </div>
      </div>
    </motion.header>
  );
};
