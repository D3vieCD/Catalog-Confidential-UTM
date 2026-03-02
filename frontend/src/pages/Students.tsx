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
import { StudentGrid, StudentFilters, StudentModal } from '../components/students';
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