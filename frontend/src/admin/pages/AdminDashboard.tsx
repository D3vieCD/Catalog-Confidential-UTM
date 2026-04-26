import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdmin, type AdminStats, type AdminActivity } from '../../hooks/useAdmin';

const TYPE_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  create: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', label: 'Adăugat' },
  update: { bg: 'bg-amber-100 dark:bg-amber-900/30',   text: 'text-amber-600 dark:text-amber-400',   label: 'Modificat' },
  delete: { bg: 'bg-red-100 dark:bg-red-900/30',       text: 'text-red-600 dark:text-red-400',       label: 'Șters' },
};

const statCards = (stats: AdminStats) => [
  {
    label: 'Total Utilizatori',
    value: stats.totalUsers,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: 'Total Studenți',
    value: stats.totalStudents,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    label: 'Total Grupe',
    value: stats.totalGroups,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Medie Globală',
    value: stats.globalAverage.toFixed(1),
    iconBg: 'bg-stone-100 dark:bg-stone-700',
    iconColor: 'text-stone-600 dark:text-stone-400',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export const AdminDashboard = () => {
  const { getAdminStats, getAdminActivity } = useAdmin();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminActivity()])
      .then(([s, a]) => {
        setStats(s);
        setActivities(a);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  if (loadingData || !stats) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500 text-sm">
        Se încarcă...
      </div>
    );
  }

  const cards = statCards(stats);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Vedere de ansamblu sistem</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-stone-200 dark:border-gray-700 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
              <div className={`p-2 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Activitate Recentă */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700"
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Activitate Recentă
          </h2>
          {activities.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
              Nicio activitate înregistrată.
            </p>
          ) : (
            <div className="space-y-3">
              {activities.map((log, idx) => {
                const cfg = TYPE_CONFIG[log.type] ?? TYPE_CONFIG['create'];
                return (
                  <div key={`${log.type}-${log.id}-${idx}`} className="flex items-start gap-3">
                    <span className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.bg} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                        <span className="font-medium">{log.action}</span>{' '}
                        <span className="text-gray-500 dark:text-gray-400">{log.target}</span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{log.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Stare Sistem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700"
        >
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            Stare Sistem
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Utilizatori activi</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {stats.totalUsers}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Grupe active</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.totalGroups}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Studenți înregistrați</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.totalStudents}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Medie globală</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {stats.globalAverage.toFixed(1)}
              </span>
            </div>
            <div className="mt-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                Sistem funcțional
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
