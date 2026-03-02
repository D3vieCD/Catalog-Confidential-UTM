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