import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { MOCK_ADMIN_GROUPS } from '../_mock/mockAdminData';
import type { AdminGroup } from '../_mock/mockAdminData';

/**
 * AdminGroups - Comparație vizuală grupe + tabel management
 */

const STATUS_BADGE: Record<AdminGroup['status'], string> = {
  activ:   'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  arhivat: 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400',
};

const avgColor = (avg: number) => {
  if (avg >= 8.5) return '#059669';
  if (avg >= 7)   return '#F59E0B';
  return '#EF4444';
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-stone-200 dark:border-gray-700 rounded-xl px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">Grupa {label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-gray-500 dark:text-gray-400">{p.name}: <span className="font-semibold text-gray-900 dark:text-white">{p.value}</span></p>
        ))}
      </div>
    );
  }
  return null;
};

export const AdminGroups = () => {
  const [groups, setGroups] = useState<AdminGroup[]>(MOCK_ADMIN_GROUPS);
  const [search, setSearch] = useState('');

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.coordinator.toLowerCase().includes(search.toLowerCase()) ||
    g.faculty.toLowerCase().includes(search.toLowerCase())
  );

  const activeGroups = groups.filter((g) => g.status === 'activ');

  const handleArchive = (id: string) => {
    setGroups((prev) =>
      prev.map((g) => g.id === id ? { ...g, status: g.status === 'activ' ? 'arhivat' : 'activ' } : g)
    );
  };

  return (
    <div className="space-y-6">
      {/* Titlu */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grupe</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {groups.length} grupe în sistem — {activeGroups.length} active
        </p>
      </div>

      {/* Grafice comparație */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* BarChart — Studenți per grupă */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700"
        >
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Studenți per grupă</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Număr studenți înregistrați (grupe active)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activeGroups} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 8 }} />
              <Bar dataKey="studentCount" name="Studenți" radius={[6, 6, 0, 0]}>
                {activeGroups.map((g) => (
                  <Cell key={g.id} fill="#3B82F6" fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* BarChart — Medie per grupă */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700"
        >
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Performanță per grupă</h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Medie generală —{' '}
            <span className="text-emerald-600">■</span> ≥8.5{' '}
            <span className="text-amber-500 ml-1">■</span> ≥7{' '}
            <span className="text-red-500 ml-1">■</span> &lt;7
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activeGroups.filter((g) => g.average > 0)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 8 }} />
              <Bar dataKey="average" name="Medie" radius={[6, 6, 0, 0]}>
                {activeGroups.filter((g) => g.average > 0).map((g) => (
                  <Cell key={g.id} fill={avgColor(g.average)} fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

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
        transition={{ delay: 0.2 }}
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
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((group, idx) => (
                <tr
                  key={group.id}
                  className={`transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-stone-50/60 dark:bg-gray-700/20'}`}
                >
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
                      <span className="text-sm font-semibold" style={{ color: avgColor(group.average) }}>
                        {group.average.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE[group.status]}`}>
                      {group.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleArchive(group.id)}
                        title={group.status === 'activ' ? 'Arhivează' : 'Reactivează'}
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${
                          group.status === 'activ'
                            ? 'hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400'
                            : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
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
