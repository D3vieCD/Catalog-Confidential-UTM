import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getGroupById } from '../_mock/mockGroups';
import { getStudents } from '../_mock/mockStudents';
import {
  getStudentGrades,
  getStudentAbsences,
  calculateAverage,
  getGroupSubjectStats,
  addGrade,
  updateGrade,
  deleteGrade,
  type GradeFormData,
} from '../_mock/mockGrades';
import { Modal } from '../components/ui/Modal';

/**
 * GroupCatalog - Catalogul unei grupe cu note și absențe
 */
export const GroupCatalog = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const group = useMemo(() => getGroupById(groupId || ''), [groupId]);
  const students = useMemo(() => {
    if (!group) return [];
    return getStudents().filter(s => s.group === group.name && s.status === 'active');
  }, [group]);

  const [selectedSubject, setSelectedSubject] = useState(group?.subjects[0] || '');
  const [notesHidden, setNotesHidden] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Pentru a forța re-render
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null); // Pentru editare notă
  const [selectedStudentRow, setSelectedStudentRow] = useState<string | null>(null); // Pentru deblurare la click
  // Calculează statistici
  const stats = useMemo(() => {
    if (!group || !selectedSubject) return { totalStudents: 0, groupAverage: 0, totalAbsences: 0 };
    return getGroupSubjectStats(group.id, selectedSubject, students.map(s => s.id));
  }, [group, selectedSubject, students, refreshKey]);

  // Navighează înapoi
  const handleBack = () => {
    navigate('/dashboard/catalog');
  };

  // Deschide modal pentru adăugare notă
  const handleAddGrade = (studentId: string) => {
    setSelectedStudent(studentId);
    setGradeValue(null);
    setEditingGradeId(null);
    setShowGradeModal(true);
  };

  // Deschide modal pentru editare notă
  const handleEditGrade = (studentId: string, gradeId: string, currentValue: number | null) => {
    setSelectedStudent(studentId);
    setGradeValue(currentValue);
    setEditingGradeId(gradeId);
    setShowGradeModal(true);
  };

  // Salvează nota (adaugă sau editează)
  const handleSaveGrade = () => {
    if (!selectedStudent || !group) return;

    if (editingGradeId) {
      // Editare notă existentă
      updateGrade(editingGradeId, gradeValue);
    } else {
      // Adăugare notă nouă
      const data: GradeFormData = {
        value: gradeValue,
        subject: selectedSubject,
      };
      addGrade(selectedStudent, group.id, data);
    }

    setShowGradeModal(false);
    setSelectedStudent(null);
    setGradeValue(null);
    setEditingGradeId(null);

    // Force re-render fără reload
    setRefreshKey(prev => prev + 1);
  };