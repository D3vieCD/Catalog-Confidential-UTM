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
const stats: StatCard[] = [
  {
    title: 'Total Studenți',
    value: 142,
    change: '+12%',
    changeType: 'increase',
    icon: (<svg />),
    color: 'from-blue-500 to-blue-600',
  },
];