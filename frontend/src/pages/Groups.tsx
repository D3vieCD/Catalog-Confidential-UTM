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
import { GroupStats, GroupCard, GroupFilters, GroupModal } from '../components/groups';
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