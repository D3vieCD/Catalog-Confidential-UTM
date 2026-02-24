export interface ReportStats {
  totalReports: number;
  activeGroups: number;
  monthlyExports: number;
  monthlyImports: number;
}
import { motion } from 'framer-motion';
import type { ReportStats as StatsType } from '../../_mock/mockReports';

interface ReportStatsProps {
  stats: StatsType;
}

export const ReportStats = ({ stats }: ReportStatsProps) => {
  const cards = [
    {
      title: 'Total Rapoarte',
      value: stats.totalReports,
      icon: (/* SVG Purple */),
      borderColor: 'border-purple-500',
      bgIcon: 'bg-purple-100 dark:bg-purple-900/30',
    },
    // ... restul cardurilor
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 ${card.borderColor} shadow-sm`}>
           {/* UI Card */}
        </div>
      ))}
    </div>
  );
};
// Actualizare în interiorul map-ului:
<motion.div
  key={card.title}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
  className={`relative ... hover:shadow-md transition-all`}
>
  {/* Conținutul animat */}
</motion.div>