import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users2 } from 'lucide-react';
import { GroupStats, GroupCard, GroupFilters, GroupModal, GroupDetailPanel } from '../components/groups';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import type { CreateGroupDto, Group } from '../context/GroupProvider';
import useGroups from '../hooks/useGroups';

const mapGroup = (g: Group): Group => ({
  id: Number(g.id),
  groupName: g.groupName ?? '',
  year: g.year,
  faculty: g.faculty ?? '',
  specialization: g.specialization ?? '',
  coordinator: g.coordinator ?? '',
  maxCapacity: g.maxCapacity,
  currentCapacity: g.currentCapacity ?? 0,
  semester: g.semester,
  createdAt: g.createdAt ?? new Date().toISOString(),
});

export const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const { createGroup, deleteGroup, getAllGroups, updateGroup, loading: groupsLoading } = useGroups();

  const faculties = useMemo(() =>
    [...new Set(groups.map(g => g.faculty).filter(Boolean))].sort(),
    [groups]);

  const specsByFaculty = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const g of groups) {
      if (!g.faculty || !g.specialization) continue;
      if (!map[g.faculty]) map[g.faculty] = [];
      if (!map[g.faculty].includes(g.specialization)) map[g.faculty].push(g.specialization);
    }
    return map;
  }, [groups]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const backendGroups = await getAllGroups();
        setGroups(backendGroups.map(mapGroup));
      } catch (err) {
        console.error(err);
      }
    }
    fetchGroups();
  }, []);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('az');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);

  // Filtered & sorted groups
  const filteredGroups = useMemo(() => {
    let result = [...groups];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        g =>
          (g.groupName ?? '').toLowerCase().includes(q) ||
          (g.coordinator ?? '').toLowerCase().includes(q)
      );
    }

    if (selectedYear) {
      result = result.filter(g => g.year === parseInt(selectedYear));
    }

    switch (sortBy) {
      case 'az':
        result.sort((a, b) => a.groupName.localeCompare(b.groupName, 'ro'));
        break;
      case 'za':
        result.sort((a, b) => b.groupName.localeCompare(a.groupName, 'ro'));
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
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (group: Group) => {
    setEditingGroup(group);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (group: Group) => {
    setDeletingGroup(group);
  };

  const handleView = (group: Group) => {
    setViewingGroup(group);
  };

  const handleCreateGroup = async (data: CreateGroupDto) => {
    try {
      const newGroup = await createGroup(data);
      setGroups(prev => [...prev, mapGroup(newGroup)]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateGroup = async (data: CreateGroupDto) => {
    if (!editingGroup) return;
    try {
      await updateGroup(editingGroup.id, data);
      setGroups(prev => prev.map(g =>
        g.id === editingGroup.id
          ? mapGroup({ ...g, ...data })
          : g
      ));
      setIsEditModalOpen(false);
      setEditingGroup(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingGroup) return;

    if (deletingGroup.currentCapacity > 0) {
      alert('Nu poți șterge o grupă care are studenți înscriși!');
      setDeletingGroup(null);
      return;
    }

    deleteGroup(deletingGroup.id);
    setGroups(prev => prev.filter(g => g.id !== deletingGroup.id));
    setDeletingGroup(null);
  };

  if (groupsLoading) return (
    <div className="flex items-center justify-center min-h-full py-24">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
            Total: {groups.length} grupe academice
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 sm:px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Adaugă Grupă</span>
            <span className="sm:hidden">Adaugă</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <GroupStats
        totalGroups={groups.length}
        totalStudents={groups.reduce((sum, g) => sum + g.currentCapacity, 0)}
        avgStudentsPerGroup={groups.length > 0
          ? Math.round(groups.reduce((sum, g) => sum + g.currentCapacity, 0) / groups.length)
          : 0}
        totalFaculties={faculties.length}
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
            <Users2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
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

      {/* Create Modal */}
      <GroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateGroup}
        faculties={faculties}
        specsByFaculty={specsByFaculty}
      />

      {/* Edit Modal */}
      <GroupModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingGroup(null); }}
        onSave={handleUpdateGroup}
        group={editingGroup}
        faculties={faculties}
        specsByFaculty={specsByFaculty}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingGroup}
        onClose={() => setDeletingGroup(null)}
        onConfirm={handleDeleteConfirm}
        title="Șterge Grupa"
        message={`Ești sigur că vrei să ștergi grupa ${deletingGroup?.groupName}? Această acțiune nu poate fi anulată.`}
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
