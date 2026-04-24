import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users2, Search, ChevronDown } from 'lucide-react';
import { GroupStats, GroupCard, GroupModal, GroupDetailPanel } from '../components/groups';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import type { CreateGroupDto, Group } from '../context/GroupProvider';
import useGroups from '../hooks/useGroups';

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

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<Group | null>(null);
  const [viewingGroup, setViewingGroup] = useState<Group | null>(null);

  // Filtered groups
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

    result.sort((a, b) => a.groupName.localeCompare(b.groupName, 'ro'));

    return result;
  }, [groups, searchQuery, selectedYear]);

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
      {/* Header — single row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-3 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-3"
      >
        <h1 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
          Gestiune Grupe
        </h1>

        {/* Search */}
        <div className="relative flex-[2]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Caută grupă sau coordonator..."
            className="pl-9 pr-3 py-2.5 text-sm w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 transition-all"
          />
        </div>

        {/* Year filter */}
        <YearDropdown value={selectedYear} onChange={setSelectedYear} />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

        {/* Stats inline */}
        <GroupStats
          totalGroups={groups.length}
          totalStudents={groups.reduce((sum, g) => sum + g.currentCapacity, 0)}
          totalFaculties={faculties.length}
        />

        {/* Spacer */}
        <div className="flex-1" />

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 whitespace-nowrap text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Adaugă Grupă</span>
        </button>
      </motion.div>

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
