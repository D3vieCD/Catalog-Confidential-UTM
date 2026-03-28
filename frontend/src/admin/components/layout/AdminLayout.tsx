import { motion } from 'framer-motion';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout - Wrapper cu AdminHeader + AdminSidebar
 */
export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900 transition-colors duration-200">
      <AdminHeader />
      <AdminSidebar />

      {/* Conținut principal — marginLeft fix 80px (sidebar collapsed) */}
      <div
        className="pt-20 transition-all duration-300 min-h-screen bg-stone-50 dark:bg-gray-900"
        style={{ marginLeft: '80px' }}
      >
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 min-h-screen"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
