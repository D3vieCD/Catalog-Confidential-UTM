import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import type { Student, StudentFormData } from '../../_mock/mockStudents';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: StudentFormData) => void;
  student?: Student | null;
  groups: string[];
  onAddGroup: (group: string) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  student,
  groups,
  onAddGroup,
}) => {
  const isEdit = !!student;

  return <div />;
};