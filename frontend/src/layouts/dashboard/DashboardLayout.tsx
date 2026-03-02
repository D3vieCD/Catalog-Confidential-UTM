import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout - Layout principal pentru dashboard
 * Include Header fixed + Sidebar hover expand + Content alături
 */

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
      return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header - Fixed în top */}
      <Header />

      {/* Sidebar - Fixed în stânga */}
      <Sidebar />
            {/* Main Content - Restul spațiului */}
      <div
        className="pt-20 transition-all duration-300 min-h-screen bg-white dark:bg-gray-900"
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