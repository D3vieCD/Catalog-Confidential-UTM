import { motion } from 'framer-motion';
import type { Student } from '../../_mock/mockStudents';
import { getInitials } from '../../_mock/mockStudents';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  index: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete, index }) => {
  const initials = getInitials(student.name);

  return (
    <motion.div>
    </motion.div>
  );
};