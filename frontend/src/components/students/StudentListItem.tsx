import { motion } from 'framer-motion';
import type { Student } from '../../_mock/mockStudents';
import { getInitials } from '../../_mock/mockStudents';

interface StudentListItemProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  index: number;
}

export const StudentListItem: React.FC<StudentListItemProps> = ({
  student,
  onEdit,
  onDelete,
  index
}) => {
  const initials = getInitials(student.name);

  return <div></div>;
};