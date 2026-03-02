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
const [form, setForm] = useState<StudentFormData>({
  name: '',
  email: '',
  group: '',
  year: 1,
  status: 'active',
});

const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
const [showNewGroup, setShowNewGroup] = useState(false);
const [newGroupName, setNewGroupName] = useState('');
useEffect(() => {
  if (isOpen) {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        group: student.group,
        year: student.year,
        status: student.status,
      });
    } else {
      setForm({
        name: '',
        email: '',
        group: groups[0] || '',
        year: 1,
        status: 'active',
      });
    }
    setErrors({});
    setShowNewGroup(false);
    setNewGroupName('');
  }
}, [isOpen, student, groups]);