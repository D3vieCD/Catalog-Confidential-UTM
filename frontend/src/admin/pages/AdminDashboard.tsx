import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, type AdminStats, type AdminActivity } from '../../hooks/useAdmin';

function UserDropdown({
  users,
  selected,
  onChange,
}: {
  users: { id: number; firstName: string; lastName: string }[];
  selected: number | null;
  onChange: (id: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = selected
    ? (() => { const u = users.find(u => u.id === selected); return u ? `${u.firstName} ${u.lastName}` : 'Toți utilizatorii'; })()
    : 'Toți utilizatorii';

  const opts = [{ id: null, label: 'Toți utilizatorii' }, ...users.map(u => ({ id: u.id, label: `${u.firstName} ${u.lastName}` }))];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 outline-none whitespace-nowrap min-w-[180px]"
      >
        <span className="flex-1 text-left">{label}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden"
          >
            {opts.map(opt => (
              <li
                key={opt.id ?? 'all'}
                onClick={() => { onChange(opt.id); setOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  (opt.id === selected || (opt.id === null && selected === null))
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const TYPE_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  grade:   { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', label: 'Notă' },
  absence: { bg: 'bg-amber-100 dark:bg-amber-900/30',     text: 'text-amber-700 dark:text-amber-400',     label: 'Absență' },
  user:    { bg: 'bg-blue-100 dark:bg-blue-900/30',       text: 'text-blue-700 dark:text-blue-400',       label: 'Utilizator' },
  student: { bg: 'bg-violet-100 dark:bg-violet-900/30',   text: 'text-violet-700 dark:text-violet-400',   label: 'Student' },
  import:  { bg: 'bg-sky-100 dark:bg-sky-900/30',         text: 'text-sky-700 dark:text-sky-400',         label: 'Import' },
  create:  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', label: 'Adăugat' },
  update:  { bg: 'bg-amber-100 dark:bg-amber-900/30',     text: 'text-amber-700 dark:text-amber-400',     label: 'Modificat' },
  delete:  { bg: 'bg-red-100 dark:bg-red-900/30',         text: 'text-red-700 dark:text-red-400',         label: 'Șters' },
};

type ActivityFilter = 'toate' | 'grade' | 'absence' | 'user' | 'student' | 'import';
const FILTER_OPTS: { key: ActivityFilter; label: string }[] = [
  { key: 'toate',   label: 'Toate' },
  { key: 'grade',   label: 'Note' },
  { key: 'absence', label: 'Absențe' },
  { key: 'student', label: 'Studenți' },
  { key: 'import',  label: 'Importuri' },
  { key: 'user',    label: 'Utilizatori' },
];

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
  const { getAdminStats, getAdminActivity, getAllUsers } = useAdmin();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [actFilter, setActFilter] = useState<ActivityFilter>('toate');
  const [loadingData, setLoadingData] = useState(true);
  const [users, setUsers] = useState<{ id: number; firstName: string; lastName: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [loadingAct, setLoadingAct] = useState(false);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminActivity(), getAllUsers()])
      .then(([s, a, u]) => {
        setStats(s);
        setActivities(a);
        setUsers(u.map(({ id, firstName, lastName }) => ({ id, firstName, lastName })));
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  const handleUserFilter = async (userId: number | null) => {
    setSelectedUser(userId);
    setActFilter('toate');
    setLoadingAct(true);
    try {
      const a = await getAdminActivity(userId ?? undefined);
      setActivities(a);
    } finally {
      setLoadingAct(false);
    }
  };

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
          className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-stone-200 dark:border-gray-700 flex flex-col"
        >
          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Activitate Recentă</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedUser
                  ? `Activitate completă — ${users.find(u => u.id === selectedUser)?.firstName ?? ''} ${users.find(u => u.id === selectedUser)?.lastName ?? ''}`
                  : `${activities.length} înregistrări în ultimele 2 zile`}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <UserDropdown users={users} selected={selectedUser} onChange={handleUserFilter} />
              {/* Type filter */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-gray-700/50 p-1 rounded-xl flex-wrap">
                {FILTER_OPTS
                  .filter(f => selectedUser ? !['user'].includes(f.key) : !['student', 'import'].includes(f.key))
                  .map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setActFilter(f.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        actFilter === f.key
                          ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {loadingAct
            ? <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">Se încarcă...</div>
            : (() => {
            const filtered = actFilter === 'toate'
              ? activities
              : activities.filter((a) => a.type === actFilter);
            return filtered.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                Nicio activitate înregistrată.
              </p>
            ) : (
              <div className="overflow-y-auto max-h-[420px] space-y-0 pr-1 -mr-1">
                {filtered.map((log, idx) => {
                  const cfg = TYPE_CONFIG[log.type] ?? TYPE_CONFIG['create'];
                  return (
                    <div
                      key={`${log.type}-${log.id}-${idx}`}
                      className={`flex items-start gap-3 py-3 ${idx < filtered.length - 1 ? 'border-b border-stone-100 dark:border-gray-700/60' : ''}`}
                    >
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
            );
          })()}
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
