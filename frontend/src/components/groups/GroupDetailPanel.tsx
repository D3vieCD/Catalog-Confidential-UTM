import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { Group } from '../../_mock/mockGroups';
import { getStudents, getInitials } from '../../_mock/mockStudents';

interface GroupDetailPanelProps {
  group: Group | null;
  onClose: () => void;
  onEdit: (group: Group) => void;
}

// Date mock per student din grupa
const getStudentsForGroup = (groupName: string) => {
  const all = getStudents();
  return all.filter(s => s.group === groupName);
};

const getMockStudentStats = (studentId: string) => {
  const seed = parseInt(studentId) || studentId.charCodeAt(0);
  const avg = (7 + (seed % 3) + (seed % 2) * 0.5).toFixed(1);
  const attendance = 85 + (seed % 14);
  const absences = Math.max(1, Math.floor((100 - attendance) / 5));
  return { avg: parseFloat(avg), attendance, absences };
};

const getMockGroupStats = (group: Group) => {
  const students = getStudentsForGroup(group.name);
  if (students.length === 0) return { avg: 0, attendance: 0, totalAbsences: 0 };
  const stats = students.map(s => getMockStudentStats(s.id));
  const avg = stats.reduce((sum, s) => sum + s.avg, 0) / stats.length;
  const attendance = stats.reduce((sum, s) => sum + s.attendance, 0) / stats.length;
  const totalAbsences = stats.reduce((sum, s) => sum + s.absences, 0);
  return {
    avg: parseFloat(avg.toFixed(1)),
    attendance: Math.round(attendance),
    totalAbsences,
  };
};

type SortMode = 'alpha' | 'avg';

export const GroupDetailPanel: React.FC<GroupDetailPanelProps> = ({ group, onClose, onEdit }) => {
  const navigate = useNavigate();
  const [sortMode, setSortMode] = useState<SortMode>('alpha');

  return (
    <AnimatePresence>
      {group && (() => {
        const students = getStudentsForGroup(group.name);
        const groupStats = getMockGroupStats(group);

        const sortedStudents = [...students].sort((a, b) => {
          if (sortMode === 'avg') {
            return getMockStudentStats(b.id).avg - getMockStudentStats(a.id).avg;
          }
          return a.name.localeCompare(b.name, 'ro');
        });

        return (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-[60]"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 z-[70] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{group.name}</h2>
                    <span className="inline-block mt-1 px-3 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                      ANUL {group.year}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto">
                {/* Subjects + Coordinator */}
                <div className="px-6 pt-5 space-y-3">
                  {group.subjects.map((subject, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{subject}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{group.coordinator}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 px-6 mt-5">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {students.length > 0 ? groupStats.avg : '—'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Medie Grupă</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {students.length > 0 ? `${groupStats.attendance}%` : '—'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prezență</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">
                      {students.length > 0 ? groupStats.totalAbsences : '—'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Absențe Total</p>
                  </div>
                </div>

                {/* Students list */}
                <div className="px-6 mt-5 pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Studenți ({students.length})
                    </h3>
                    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                      <button
                        onClick={() => setSortMode('alpha')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          sortMode === 'alpha'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        Alfabetic
                      </button>
                      <button
                        onClick={() => setSortMode('avg')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          sortMode === 'avg'
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        Medie
                      </button>
                    </div>
                  </div>

                  {students.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                      Niciun student în această grupă
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sortedStudents.map((student) => {
                        const stats = getMockStudentStats(student.id);
                        const initials = getInitials(student.name);
                        return (
                          <button
                            key={student.id}
                            onClick={() => {
                              onClose();
                              navigate(`/dashboard/catalog/${group.id}`);
                            }}
                            className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm transition-all duration-200 text-left"
                          >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0">
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{student.name}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                                  </svg>
                                  Medie: {stats.avg}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  {stats.attendance}%
                                </span>
                                <span className="flex items-center gap-1 text-xs text-orange-500 dark:text-orange-400 font-medium">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  {stats.absences} abs.
                                </span>
                              </div>
                            </div>
                            <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/dashboard/catalog/${group.id}`);
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg text-sm col-span-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  Raport Grupă
                </button>
                <button
                  onClick={() => console.log('export')}
                  className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Export Listă
                </button>
                <button
                  onClick={() => { onClose(); onEdit(group); }}
                  className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                  Editează Grupă
                </button>
              </div>
            </motion.div>
          </>
        );
      })()}
    </AnimatePresence>
  );
};
