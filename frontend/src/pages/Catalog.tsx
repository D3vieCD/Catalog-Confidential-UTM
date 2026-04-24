import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users2, GraduationCap, BookOpen, User, Search, ChevronDown } from 'lucide-react';
import useGroups from '../hooks/useGroups';
import type { Group } from '../context/GroupProvider';

const yearOptions = [
  { value: '', label: 'Toți Anii' },
  { value: '1', label: 'Anul 1' },
  { value: '2', label: 'Anul 2' },
  { value: '3', label: 'Anul 3' },
  { value: '4', label: 'Anul 4' },
];

const YearDropdown: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = yearOptions.find(o => o.value === value) ?? yearOptions[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer whitespace-nowrap"
      >
        {selected.label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full min-w-[110px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
          >
            {yearOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors duration-150 ${
                  opt.value === value
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Catalog = () => {
  const navigate = useNavigate();
  const { getAllGroups } = useGroups();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    getAllGroups().then(data => {
      setGroups(data);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...groups];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g =>
        g.groupName.toLowerCase().includes(q) ||
        (g.specialization ?? '').toLowerCase().includes(q) ||
        (g.coordinator ?? '').toLowerCase().includes(q)
      );
    }
    if (selectedYear) {
      result = result.filter(g => g.year === parseInt(selectedYear));
    }
    result.sort((a, b) => a.groupName.localeCompare(b.groupName, 'ro'));
    return result;
  }, [groups, searchQuery, selectedYear]);

  const handleGroupClick = (groupId: number) => {
    navigate(`/dashboard/catalog/${groupId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-full pb-8">
      {/* Header bar — same pattern as Groups/Students */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3"
      >
        <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
          Catalog Digital
        </h1>

        {/* Search */}
        <div className="relative flex-[2]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Caută grupă, specializare sau coordonator..."
            className="pl-9 pr-3 py-2 text-sm w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all"
          />
        </div>

        {/* Year filter */}
        <YearDropdown value={selectedYear} onChange={setSelectedYear} />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

        {/* Count badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700/60 rounded-xl border border-gray-200 dark:border-gray-600 whitespace-nowrap">
          <Users2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Grupe</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">{groups.length}</span>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <Users2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Nicio grupă găsită</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {searchQuery || selectedYear
                ? 'Încearcă să modifici filtrele de căutare'
                : 'Nu există grupe înregistrate'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((group, index) => {
              const capacityPercentage = Math.min((group.currentCapacity / group.maxCapacity) * 100, 100);
              const capacityColor =
                capacityPercentage >= 90 ? 'bg-red-400' :
                capacityPercentage >= 70 ? 'bg-orange-400' : 'bg-emerald-400';
              const capacityText =
                capacityPercentage >= 90 ? 'text-red-500' :
                capacityPercentage >= 70 ? 'text-orange-500' : 'text-emerald-500';

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.6) }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
                  onClick={() => handleGroupClick(group.id)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

                  <div className="p-5">
                    {/* Icon + name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm flex-shrink-0">
                        <Users2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                          {group.groupName}
                        </h3>
                        <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold rounded-full">
                          ANUL {group.year} · SEM {group.semester}
                        </span>
                      </div>
                    </div>

                    {/* Info rows */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate font-medium">{group.faculty || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <BookOpen className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span className="truncate">{group.specialization || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span className="truncate">{group.coordinator || '—'}</span>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 dark:text-gray-500 font-medium">Capacitate</span>
                        <span className={`font-bold ${capacityText}`}>
                          {group.currentCapacity}/{group.maxCapacity}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${capacityColor} rounded-full transition-all duration-500`}
                          style={{ width: `${capacityPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};
