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
const validate = (): boolean => {
  const newErrors: { name?: string; email?: string } = {};
  if (!form.name.trim()) newErrors.name = 'Numele este obligatoriu';
  if (!form.email.trim()) {
    newErrors.email = 'Email-ul este obligatoriu';
  } else if (!form.email.includes('@')) {
    newErrors.email = 'Email-ul nu este valid';
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (!validate()) return;
  onSave(form);
};

const handleAddNewGroup = () => {
  const trimmed = newGroupName.trim().toUpperCase();
  if (trimmed) {
    onAddGroup(trimmed);
    setForm({ ...form, group: trimmed });
    setShowNewGroup(false);
    setNewGroupName('');
  }
};
const inputClasses = (hasError: boolean) =>
  `w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border ${
    hasError ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-gray-600'
  } rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`;

const labelClasses =
  'block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5';