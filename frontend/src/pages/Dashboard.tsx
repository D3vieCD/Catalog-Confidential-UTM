import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { WelcomeSection } from '../components/dashboard/WelcomeSection';
import { StatsCard, type StatsCardProps } from '../components/dashboard/StatsCard';
import { RecentActivity, type Activity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';

export const Dashboard = () => {
  const { getUser } = useAuth();
  const currentUser = getUser();
  const { getDashboardStats, getRecentActivity } = useDashboard();

  const [stats, setStats] = useState<StatsCardProps[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const user = {
    name: currentUser.name,
    role: currentUser.role === 'admin' ? 'Administrator' : 'Profesor',
    initials: currentUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
    avatar: null
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);

        const dashboardStats = await getDashboardStats();

        const transformedStats: StatsCardProps[] = [
          {
            title: 'Total Studenți',
            value: dashboardStats.totalStudents,
            icon: 'users',
            color: 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300',
            changeType: 'increase',
          },
          {
            title: 'Note Adăugate',
            value: dashboardStats.totalGrades,
            icon: 'book',
            color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
            changeType: 'increase',
          },
          {
            title: 'Medie Generală',
            value: dashboardStats.averageGrade,
            icon: 'chart',
            color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            changeType: 'increase',
          },
          {
            title: 'Absențe Luna',
            value: dashboardStats.totalAbsencesThisMonth,
            icon: 'warning',
            color: 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400',
            changeType: 'decrease',
          },
        ];

        setStats(transformedStats);

        const activities = await getRecentActivity();
        setRecentActivities(activities);

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Se încarcă...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <WelcomeSection user={user} />
      </motion.div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <RecentActivity activities={recentActivities} />
        </motion.div>

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
