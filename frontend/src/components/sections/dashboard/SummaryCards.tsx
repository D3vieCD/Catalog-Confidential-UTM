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
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  {stats.map((stat, index) => (
    <motion.div key={stat.title}>
    </motion.div>
  ))}
</div>
<motion.div
  key={stat.title}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: index * 0.1 }}
  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
>
</motion.div>
<div className="flex items-center justify-between mb-4">
  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white`}>
    {stat.icon}
  </div>
  <div className={`flex items-center gap-1 text-sm font-medium ${
    stat.changeType === 'increase'
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400'
  }`}>
    {stat.change}
  </div>
</div>
<div>
  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
    {stat.value}
  </div>
  <div className="text-sm text-gray-600 dark:text-gray-400">
    {stat.title}
  </div>
  {stat.subtitle && (
    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
      {stat.subtitle}
    </div>
  )}
</div>