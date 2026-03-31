import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Group, GroupFormData } from '../_mock/mockGroups';
import {
  getGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  getGroupStats,
} from '../_mock/mockGroups';
import { GroupStats, GroupCard, GroupFilters, GroupModal, GroupDetailPanel } from '../components/groups';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export const Groups = () => {
  // Data
  const [groups, setGroups] = useState<Group[]>(() => getGroups());
  const stats = useMemo(() => getGroupStats(), [groups]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('az');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);
  // Filtered & sorted groups
  const filteredGroups = useMemo(() => {
    let result = [...groups];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        g =>
          g.name.toLowerCase().includes(q) ||
          g.specialization.toLowerCase().includes(q) ||
          g.coordinator.toLowerCase().includes(q) ||
          g.faculty.toLowerCase().includes(q)
      );
    }

    // Year filter
    if (selectedYear) {
      result = result.filter(g => g.year === parseInt(selectedYear));
    }

    // Status filter - show only active groups
    result = result.filter(g => g.status === 'ACTIV');

    // Sorting
    switch (sortBy) {
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name, 'ro'));
        break;
      case 'za':
        result.sort((a, b) => b.name.localeCompare(a.name, 'ro'));
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'capacity-asc':
        result.sort((a, b) => a.currentCapacity - b.currentCapacity);
        break;
      case 'capacity-desc':
        result.sort((a, b) => b.currentCapacity - a.currentCapacity);
        break;
    }

    return result;
  }, [groups, searchQuery, selectedYear, sortBy]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (group: Group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (group: Group) => {
    setDeletingGroup(group);
  };

  const handleView = (group: Group) => {
    setViewingGroup(group);
  };

  const handleSave = (data: GroupFormData) => {
    if (editingGroup) {
      const updated = updateGroup(editingGroup.id, data);
      if (updated) {
        setGroups(prev => prev.map(g => (g.id === updated.id ? updated : g)));
      }
    } else {
      const newGroup = addGroup(data);
      setGroups(prev => [...prev, newGroup]);
    }
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingGroup) return;

    // Check if group has students
    if (deletingGroup.currentCapacity > 0) {
      alert('Nu poți șterge o grupă care are studenți înscriși!');
      setDeletingGroup(null);
      return;
    }

    deleteGroup(deletingGroup.id);
    setGroups(prev => prev.filter(g => g.id !== deletingGroup.id));
    setDeletingGroup(null);
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
            Gestiune Grupe
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
            Total: {stats.totalGroups} grupe academice
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Add Group Button */}
          <button
            onClick={handleOpenAdd}
            className="px-4 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            <span className="hidden sm:inline">Adaugă Grupă</span>
            <span className="sm:hidden">Adaugă</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <GroupStats
        totalGroups={stats.totalGroups}
        totalStudents={stats.totalStudents}
        avgStudentsPerGroup={stats.avgStudentsPerGroup}
        totalFaculties={stats.totalFaculties}
      />

      {/* Filters */}
      <GroupFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Groups Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {filteredGroups.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-200 dark:border-gray-700">
            <svg
              className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Nicio grupă găsită
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {searchQuery || selectedYear
                ? 'Încearcă să modifici filtrele de căutare'
                : 'Adaugă prima grupă pentru a începe'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGroups.map((group, index) => (
              <GroupCard
                key={group.id}
                group={group}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onView={handleView}
                index={index}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <GroupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSave}
        group={editingGroup}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingGroup}
        onClose={() => setDeletingGroup(null)}
        onConfirm={handleDeleteConfirm}
        title="Șterge Grupa"
        message={`Ești sigur că vrei să ștergi grupa ${deletingGroup?.name}? Această acțiune nu poate fi anulată.`}
        confirmText="Da, șterge"
        cancelText="Anulează"
      />

      {/* Group Detail Panel */}
      <GroupDetailPanel
        group={viewingGroup}
        onClose={() => setViewingGroup(null)}
        onEdit={(group) => { setViewingGroup(null); handleOpenEdit(group); }}
      />
    </div>
  );
};