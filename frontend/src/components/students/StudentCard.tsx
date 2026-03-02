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
{/* Hover Actions */}
<div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
  <button
    onClick={() => onEdit(student)}
    className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
    title="Editeaza"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
    </svg>
  </button>

  <button
    onClick={() => onDelete(student)}
    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200"
    title="Sterge"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
    </svg>
  </button>
</div>
{/* Avatar with Status */}
<div className="relative w-14 h-14 mb-4">
  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold bg-gradient-to-br from-blue-500 to-indigo-600">
    {initials}
  </div>
  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 bg-green-500" />
</div>
{/* Name */}
<h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 pr-16">
  {student.name}
</h3>

{/* Email */}
<div className="flex items-center gap-2 mb-4">
  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
  <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
    {student.email}
  </span>
</div>
{/* Badges */}
<div className="flex items-center gap-2 flex-wrap">
  <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full">
    {student.group}
  </span>

  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
    ANUL {student.year}
  </span>