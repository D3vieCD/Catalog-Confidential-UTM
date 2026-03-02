import { motion } from 'framer-motion'

/**
 * SummaryCards - Carduri de statistici pentru dashboard
 */

interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}
export const SummaryCards = () => {
  return (
    <div>
    </div>
  );
};