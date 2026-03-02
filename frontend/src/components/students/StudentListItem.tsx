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
return (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 flex items-center gap-4"
  >
  </motion.div>
);
{/* Avatar */}
<div className="relative flex-shrink-0">
  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-blue-500 to-indigo-600">
    {initials}
  </div>
  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-green-500" />
</div>