import { motion } from 'framer-motion';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { StatsCard } from '../components/dashboard/StatsCard';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';
import { mockDashboardData } from '../_mock/mockDashboard';
import { useAuth } from '../hooks/useAuth';

/**
 * Dashboard Page - Pagina principală a dashboard-ului
 * Afișează overview cu statistici, activitate recentă și orele de astăzi
 */

export const Dashboard = () => {
  const { stats, recentActivities } = mockDashboardData;
  const { getUser } = useAuth();
  const currentUser = getUser();
  
  console.log('Current user data:', currentUser);
  
  // Creează obiect user compatibil cu WelcomeSection
  const user = {
    name: currentUser.name,
    role: currentUser.role === 'admin' ? 'Administrator' : 'Profesor',
    initials: currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    avatar: null
  };
  
  console.log('Formatted user data:', user);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <WelcomeSection user={user} />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <RecentActivity activities={recentActivities} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <QuickActions />
        </motion.div>
      </div>
    </div>
  );
};