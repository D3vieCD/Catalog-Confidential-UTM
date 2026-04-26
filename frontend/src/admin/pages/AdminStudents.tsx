import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAdmin from '../../hooks/useAdmin';
import type { AdminStudentDto } from '../../context/AdminProvider';

interface DropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
}

function Dropdown({ value, onChange, options }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find((o) => o.value === value)?.label ?? options[0].label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm shadow-sm transition-all focus:ring-2 focus:ring-emerald-500 outline-none whitespace-nowrap"
      >
        {selected}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
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
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors
                  ${opt.value === value
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

export const AdminStudents = () => {
  const { getAdminStudents, loading } = useAdmin();
  const [students, setStudents] = useState<AdminStudentDto[]>([]);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('toate');
  const [facultyFilter, setFacultyFilter] = useState('toate');
  const [csvUrl, setCsvUrl] = useState('');

  useEffect(() => {
    getAdminStudents().then(setStudents).catch(() => {});
  }, []);

  const uniqueGroups = useMemo(
    () => [...new Set(students.map((s) => s.groupName).filter(Boolean))].sort(),
    [students]
  );
  const uniqueFaculties = useMemo(
    () => [...new Set(students.map((s) => s.faculty).filter(Boolean))].sort(),
    [students]
  );

  const groupOptions = useMemo(() => [
    { label: 'Toate grupele', value: 'toate' },
    ...uniqueGroups.map((g) => ({ label: g, value: g })),
  ], [uniqueGroups]);

  const facultyOptions = useMemo(() => [
    { label: 'Toate facultățile', value: 'toate' },
    ...uniqueFaculties.map((f) => ({ label: f, value: f })),
  ], [uniqueFaculties]);

  const filtered = students.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchGroup = groupFilter === 'toate' || s.groupName === groupFilter;
    const matchFaculty = facultyFilter === 'toate' || s.faculty === facultyFilter;
    return matchSearch && matchGroup && matchFaculty;
  });

  const exportCsv = () => {
    const headers = ['Nume', 'Email', 'Grupă', 'Facultate', 'An', 'Medie', 'Absențe'];
    const rows = filtered.map((s) =>
      [s.fullName, s.email, s.groupName, s.faculty, s.year, s.average, s.absences].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);
    setTimeout(() => { setCsvUrl(''); URL.revokeObjectURL(url); }, 500);
  };

  const getAverageColor = (avg: number) => {
    if (avg >= 8.5) return 'text-emerald-600 dark:text-emerald-400';
    if (avg >= 6)   return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading && students.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400 text-sm">Se încarcă...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="mr-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Studenți</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {students.length} studenți în sistem
          </p>
        </div>

        <div className="flex-1 min-w-48">
          <input
            type="text"
            placeholder="Caută după nume sau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm transition-all shadow-sm"
          />
        </div>

        <Dropdown value={groupFilter} onChange={setGroupFilter} options={groupOptions} />
        <Dropdown value={facultyFilter} onChange={setFacultyFilter} options={facultyOptions} />

        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-stone-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-gray-700 rounded-2xl font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
        {csvUrl && (
          <a href={csvUrl} download="studenti.csv" className="hidden" ref={(el) => el?.click()} />
        )}
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
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grupă</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Facultate</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">An</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medie</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Absențe</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, idx) => (
                <tr
                  key={student.id}
                  className={`transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-stone-50/60 dark:bg-gray-700/20'}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-stone-600 dark:text-stone-300 text-xs font-semibold">
                          {student.fullName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{student.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{student.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                      {student.groupName || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{student.faculty || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{student.year || '—'}</td>
                  <td className="px-6 py-4">
                    {student.average > 0 ? (
                      <span className={`text-sm font-semibold ${getAverageColor(student.average)}`}>
                        {student.average.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${student.absences > 5 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {student.absences}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
                    Niciun student găsit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-stone-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} din {students.length} studenți afișați
        </div>
      </motion.div>
    </div>
  );
};
