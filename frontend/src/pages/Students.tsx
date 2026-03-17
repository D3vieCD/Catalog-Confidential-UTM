import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Student, StudentFormData } from '../_mock/mockStudents';
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getGroups,
  addGroup,
} from '../_mock/mockStudents';
import { StudentGrid, StudentFilters, StudentModal, StudentDetailPanel } from '../components/students';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export const Students = () => {
  // Data
  const [students, setStudents] = useState<Student[]>(() => getStudents());
  const [groups, setGroups] = useState<string[]>(() => getGroups());

  // View
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('az');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Filtered & sorted students
  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      );
    }

    if (selectedGroup) {
      result = result.filter(s => s.group === selectedGroup);
    }

    if (selectedYear) {
      result = result.filter(s => s.year === parseInt(selectedYear));
    }

    switch (sortBy) {
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name, 'ro'));
        break;
      case 'za':
        result.sort((a, b) => b.name.localeCompare(a.name, 'ro'));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    return result;
  }, [students, searchQuery, selectedGroup, selectedYear, sortBy]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (student: Student) => {
    setDeletingStudent(student);
  };

  const handleView = (student: Student) => {
    setViewingStudent(student);
  };

  const handleSave = (data: StudentFormData) => {
    if (editingStudent) {
      const updated = updateStudent(editingStudent.id, data);
      if (updated) {
        // Reîmprospătează lista din localStorage
        setStudents(getStudents());
      }
    } else {
      addStudent(data);
      // Reîmprospătează lista din localStorage
      setStudents(getStudents());
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingStudent) return;
    const success = deleteStudent(deletingStudent.id);
    if (success) {
      // Reîmprospătează lista din localStorage
      setStudents(getStudents());
    }
    setDeletingStudent(null);
  };

  const handleAddGroup = (group: string) => {
    const updated = addGroup(group);
    setGroups(updated);
  };

  return (
    <div className="space-y-6 min-h-full pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gestiune Studenți
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Total: {students.length} studenți înregistrați
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid/List Toggle */}
          <div className="flex bg-white dark:bg-gray-700 rounded-xl p-1 border border-gray-200 dark:border-gray-600 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm text-white'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              title="Vizualizare grid"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm text-white'
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
              title="Vizualizare listă"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>

          {/* Add Student Button */}
          <button
            onClick={handleOpenAdd}
            className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
            <span className="hidden sm:inline">Adaugă Student</span>
            <span className="sm:hidden">Adaugă</span>
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <StudentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        sortBy={sortBy}
        onSortChange={setSortBy}
        groups={groups}
      />

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
        onAddGroup={handleAddGroup}
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
