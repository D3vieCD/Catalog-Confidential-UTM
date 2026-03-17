import { motion } from 'framer-motion';
import type { ReportStats as StatsType } from '../../_mock/mockReports';

interface ReportStatsProps {
  stats: StatsType;
}

/**
 * ReportStats - Carduri cu statistici pentru rapoarte
 */
export const ReportStats = ({ stats }: ReportStatsProps) => {
  const cards = [
    {
      title: 'Total Rapoarte',
      value: stats.totalReports,
      icon: (
        <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      borderColor: 'border-purple-500',
      bgIcon: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      title: 'Grupe Active',
      value: stats.activeGroups,
      icon: (
        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
      borderColor: 'border-blue-500',
      bgIcon: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Exporturi Luna',
      value: stats.monthlyExports,
      icon: (
        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
        </svg>
      ),
      borderColor: 'border-green-500',
      bgIcon: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Importuri Luna',
      value: stats.monthlyImports,
      icon: (
        <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
        </svg>
      ),
      borderColor: 'border-orange-500',
      bgIcon: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 ${card.borderColor} shadow-sm hover:shadow-md transition-all`}
        >
          {/* Icon în colțul din dreapta sus */}
          <div className={`absolute top-4 right-4 ${card.bgIcon} p-3 rounded-xl`}>
            {card.icon}
          </div>

          {/* Text și număr */}
          <div className="pr-16">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-2">{card.title}</p>
            <p className="text-5xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
