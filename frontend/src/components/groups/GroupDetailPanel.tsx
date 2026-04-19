import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Users2, BookOpen, User, GraduationCap, BarChart3, ChevronRight, Download, Pencil } from 'lucide-react';
import type { Group } from '../../context/GroupProvider';
import type { UIStudent } from '../../context/StudentProvider';
import { getInitials } from '../../context/StudentProvider';
import useStudents from '../../hooks/useStudents';

interface GroupDetailPanelProps {
  group: Group | null;
  onClose: () => void;
  onEdit: (group: Group) => void;
}

type SortMode = 'alpha' | 'avg';

export const GroupDetailPanel: React.FC<GroupDetailPanelProps> = ({ group, onClose, onEdit }) => {
  const navigate = useNavigate();
  const [sortMode, setSortMode] = useState<SortMode>('alpha');
  const [students, setStudents] = useState<UIStudent[]>([]);
  const { getAllStudents } = useStudents();

  useEffect(() => {
    if (!group) { setStudents([]); return; }
    getAllStudents()
      .then(all => {
        const filtered = all
          .filter(s => s != null && s.groupId === group.id)
          .map(s => ({
            id: String(s.id),
            name: s.fullName,
            email: s.email,
            phoneNumber: s.phoneNumber,
            group: group.groupName,
            year: group.year,
            status: 'active' as const,
            createdAt: s.createdOn,
            groupId: s.groupId,
          }));
        setStudents(filtered);
      })
      .catch(console.error);
  }, [group]);

  const sortedStudents = [...students].sort((a, b) =>
    sortMode === 'alpha' ? a.name.localeCompare(b.name, 'ro') : 0
  );

  return (
    <AnimatePresence>
      {group && (
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
                  <Users2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{group.groupName}</h2>
                  <span className="inline-block mt-1 px-3 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                    ANUL {group.year}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Faculty, Specialization, Coordinator */}
              <div className="px-6 pt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Facultate</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{group.faculty || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Specializare</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{group.specialization || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Coordinator</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{group.coordinator || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Stats placeholder */}
              <div className="grid grid-cols-3 gap-3 px-6 mt-5">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">—</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Medie Grupă</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">—</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prezență</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-500 dark:text-orange-400">—</p>
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
                    {sortedStudents.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => { onClose(); navigate(`/dashboard/catalog/${group.id}`); }}
                        className="w-full flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 hover:shadow-sm transition-all duration-200 text-left"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0">
                          {getInitials(student.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{student.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.email}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3">
              <button
                onClick={() => { onClose(); navigate(`/dashboard/catalog/${group.id}`); }}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg text-sm col-span-2"
              >
                <BarChart3 className="w-4 h-4" />
                Raport Grupă
              </button>
              <button
                onClick={() => console.log('export')}
                className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export Listă
              </button>
              <button
                onClick={() => { onClose(); onEdit(group); }}
                className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-colors text-sm"
              >
                <Pencil className="w-4 h-4" />
                Editează Grupă
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
