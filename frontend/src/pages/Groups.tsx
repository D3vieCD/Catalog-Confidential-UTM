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