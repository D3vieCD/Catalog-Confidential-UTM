import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import type { UIStudent, StudentFormData } from '../context/StudentProvider';
import type { Group } from '../context/GroupProvider';
import useStudents from '../hooks/useStudents';
import useGroups from '../hooks/useGroups';
import { StudentGrid, StudentModal, StudentDetailPanel } from '../components/students';
import { ConfirmModal } from '../components/ui/ConfirmModal';

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

const mapToUIStudent = (s: { id: number; fullName: string; email: string; phoneNumber: string; createdOn: string; groupId: number }, groups: Group[]): UIStudent => {
  const group = groups.find(g => g.id === s.groupId);
  return {
    id: s.id.toString(),
    name: s.fullName,
    email: s.email,
    phoneNumber: s.phoneNumber,
    group: group?.groupName ?? '',
    year: group?.year ?? 0,
    status: 'active',
    createdAt: s.createdOn,
    groupId: s.groupId,
  };
};

export const Students = () => {
  const { createStudent, updateStudent, deleteStudent, getAllStudents, loading } = useStudents();
  const { getAllGroups } = useGroups();

  const [students, setStudents] = useState<UIStudent[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [backendStudents, backendGroups] = await Promise.all([
          getAllStudents(),
          getAllGroups(),
        ]);
        setGroups(backendGroups);
        setStudents(backendStudents.filter(s => s != null).map(s => mapToUIStudent(s, backendGroups)));
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // View
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<UIStudent | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<UIStudent | null>(null);
  const [viewingStudent, setViewingStudent] = useState<UIStudent | null>(null);

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }

    if (selectedYear) {
      result = result.filter(s => s.year === parseInt(selectedYear));
    }

    result.sort((a, b) => a.name.localeCompare(b.name, 'ro'));

    return result;
  }, [students, searchQuery, selectedYear]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: UIStudent) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (student: UIStudent) => {
    setDeletingStudent(student);
  };

  const handleView = (student: UIStudent) => {
    setViewingStudent(student);
  };

  const handleSave = async (data: StudentFormData) => {
    const group = groups.find(g => g.groupName === data.group);
    const groupId = group?.id ?? 0;

    try {
      if (editingStudent) {
        await updateStudent(parseInt(editingStudent.id), {
          fullName: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
        setStudents(prev => prev.map(s =>
          s.id === editingStudent.id
            ? { ...s, name: data.name, email: data.email, phoneNumber: data.phoneNumber, group: data.group, year: group?.year ?? s.year }
            : s
        ));
      } else {
        const created = await createStudent({
          fullName: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          groupId,
        });
        if (created) {
          setStudents(prev => [...prev, mapToUIStudent(created, groups)]);
        } else {
          const refreshed = await getAllStudents();
          setStudents(refreshed.filter(s => s != null).map(s => mapToUIStudent(s, groups)));
        }
      }
    } catch (err) {
      console.error(err);
    }

    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      await deleteStudent(parseInt(deletingStudent.id));
      setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
    } catch (err) {
      console.error(err);
    }
    setDeletingStudent(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-full py-24">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 min-h-full pb-8">
      {/* Header — single row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3"
      >
        <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
          Gestiune Studenți
        </h1>

        {/* Search */}
        <div className="relative flex-[2]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută după nume sau email..."
            className="pl-9 pr-3 py-2 text-sm w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all"
          />
        </div>

        {/* Year filter */}
        <YearDropdown value={selectedYear} onChange={setSelectedYear} />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

        {/* View toggle */}
        <div className="flex bg-gray-50 dark:bg-gray-700 rounded-xl p-1 border border-gray-200 dark:border-gray-600">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title="Vizualizare grid"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title="Vizualizare listă"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
          Adaugă Student
        </button>
      </motion.div>

      {/* Student Grid/List */}
      <StudentGrid
        students={filteredStudents}
        viewMode={viewMode}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onView={handleView}
      />

      {/* Add/Edit Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingStudent(null); }}
        onSave={handleSave}
        student={editingStudent}
        groups={groups}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
        title="Șterge Student"
        message={`Ești sigur că vrei să ștergi studentul ${deletingStudent?.name}? Această acțiune nu poate fi anulată.`}
        confirmText="Da, șterge"
        cancelText="Anulează"
      />

      {/* Student Detail Panel */}
      <StudentDetailPanel
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
        onEdit={(student) => { setViewingStudent(null); handleOpenEdit(student); }}
      />
    </div>
  );
};
