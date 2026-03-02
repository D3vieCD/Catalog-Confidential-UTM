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

  const handleSave = (data: StudentFormData) => {
    if (editingStudent) {
      const updated = updateStudent(editingStudent.id, data);
      if (updated) {
        setStudents(getStudents());
      }
    } else {
      addStudent(data);
      setStudents(getStudents());
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingStudent) return;
    const success = deleteStudent(deletingStudent.id);
    if (success) {
      setStudents(getStudents());
    }
    setDeletingStudent(null);
  };

  const handleAddGroup = (group: string) => {
    const updated = addGroup(group);
    setGroups(updated);
  };