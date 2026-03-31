import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_ADMIN_GROUPS } from '../_mock/mockAdminData';
import type { AdminGroup } from '../_mock/mockAdminData';

/**
 * AdminGroups - Overview grupe sistem
 */

const STATUS_BADGE: Record<AdminGroup['status'], string> = {
  activ:    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  arhivat:  'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400',
};

export const AdminGroups = () => {
  const [groups, setGroups] = useState<AdminGroup[]>(MOCK_ADMIN_GROUPS);
  const [search, setSearch] = useState('');

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.coordinator.toLowerCase().includes(search.toLowerCase()) ||
    g.faculty.toLowerCase().includes(search.toLowerCase())
  );

  const handleArchive = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => g.id === id ? { ...g, status: g.status === 'activ' ? 'arhivat' : 'activ' } : g)
    );
  };

  const activeCount = groups.filter((g) => g.status === 'activ').length;
  const totalStudents = groups.filter((g) => g.status === 'activ').reduce((s, g) => s + g.studentCount, 0);
  const avgGrade = groups.filter((g) => g.average > 0);
  const globalAvg = avgGrade.length > 0
    ? (avgGrade.reduce((s, g) => s + g.average, 0) / avgGrade.length).toFixed(1)
    : '-';

  return (
    <div className="space-y-6">
      {/* Titlu */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grupe</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {groups.length} grupe în sistem ({activeCount} active)
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Grupe active', value: activeCount, iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Total studenți', value: totalStudents, iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
          { label: 'Medie globală', value: globalAvg, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-600 dark:text-amber-400' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-stone-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.iconColor}`}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Căutare */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-stone-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="Caută după grupă, coordonator sau facultate..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-all"
        />
      </div>

      {/* Tabel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-stone-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50 dark:bg-gray-700/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grupă</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coordonator</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Facultate / An</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Studenți</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medie</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((group, idx) => (
                <tr key={group.id} className={`transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-stone-50/60 dark:bg-gray-700/20'}`}>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{group.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{group.coordinator}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{group.faculty}</span>
                    <span className="ml-2 text-xs text-gray-400">Anul {group.year}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{group.studentCount}</td>
                  <td className="px-6 py-4">
                    {group.average > 0 ? (
                      <span className={`text-sm font-semibold ${group.average >= 8 ? 'text-emerald-600 dark:text-emerald-400' : group.average >= 6 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                        {group.average.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[group.status]}`}>
                      {group.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleArchive(group.id)}
                        title={group.status === 'activ' ? 'Arhivează' : 'Reactivează'}
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${group.status === 'activ' ? 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
                      >
                        {group.status === 'activ' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    Nicio grupă găsită.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
