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
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.6) }}
  whileHover={{ y: -4 }}
  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 relative"
>
</motion.div>