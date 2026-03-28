import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_ADMIN_STUDENTS } from '../_mock/mockAdminData';
import type { AdminStudent } from '../_mock/mockAdminData';

/**
 * AdminStudents - Overview global studenți
 */

const UNIQUE_GROUPS = [...new Set(MOCK_ADMIN_STUDENTS.map((s) => s.group))].sort();
const UNIQUE_FACULTIES = [...new Set(MOCK_ADMIN_STUDENTS.map((s) => s.faculty))].sort();

export const AdminStudents = () => {
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('toate');
  const [facultyFilter, setFacultyFilter] = useState('toate');

  const filtered = MOCK_ADMIN_STUDENTS.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchGroup = groupFilter === 'toate' || s.group === groupFilter;
    const matchFaculty = facultyFilter === 'toate' || s.faculty === facultyFilter;
    return matchSearch && matchGroup && matchFaculty;
  });

  const [csvUrl, setCsvUrl] = useState('');

  const exportCsv = () => {
    const headers = ['Nume', 'Email', 'Grupă', 'Facultate', 'An', 'Medie', 'Absențe'];
    const rows = filtered.map((s) =>
      [s.name, s.email, s.group, s.faculty, s.year, s.average, s.absences].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    setCsvUrl(url);
    setTimeout(() => { setCsvUrl(''); URL.revokeObjectURL(url); }, 500);
  };

  const getAverageColor = (avg: number) => {
    if (avg >= 8.5) return 'text-emerald-600 dark:text-emerald-400';
    if (avg >= 6) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Titlu + Export */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Studenți</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {MOCK_ADMIN_STUDENTS.length} studenți în sistem
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-stone-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-stone-50 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors shadow-sm"
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

      {/* Filtre */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-stone-200 dark:border-gray-700 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Caută după nume sau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-all"
        />
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        >
          <option value="toate">Toate grupele</option>
          {UNIQUE_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
        >
          <option value="toate">Toate facultățile</option>
          {UNIQUE_FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
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
              {filtered.map((student: AdminStudent, idx: number) => (
                <tr key={student.id} className={`transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-stone-50/60 dark:bg-gray-700/20'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-stone-600 dark:text-stone-300 text-xs font-semibold">{student.name.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{student.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                      {student.group}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{student.faculty}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{student.year}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${getAverageColor(student.average)}`}>
                      {student.average.toFixed(1)}
                    </span>
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
          {filtered.length} din {MOCK_ADMIN_STUDENTS.length} studenți afișați
        </div>
      </motion.div>
    </div>
  );
};
