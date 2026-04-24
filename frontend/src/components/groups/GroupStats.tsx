import { motion } from 'framer-motion';

interface GroupStatsProps {
  totalGroups: number;
  totalStudents: number;
  totalFaculties: number;
}

export const GroupStats: React.FC<GroupStatsProps> = ({
  totalGroups,
  totalStudents,
  totalFaculties,
}) => {
  const stats = [
    {
      label: 'Total Grupe',
      value: totalGroups,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      ),
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Total Studenți',
      value: totalStudents,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      ),
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Facultăți',
      value: totalFaculties,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
        </svg>
      ),
      iconBg: 'bg-stone-100 dark:bg-stone-700',
      iconColor: 'text-stone-600 dark:text-stone-300',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600"
        >
          <div className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center ${stat.iconColor} flex-shrink-0`}>
            {stat.icon}
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-none mb-0.5">{stat.label}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white leading-none">{stat.value}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
