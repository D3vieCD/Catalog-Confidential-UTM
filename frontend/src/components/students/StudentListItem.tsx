import { motion } from 'framer-motion';
import type { UIStudent } from '../../context/StudentProvider';
import { getInitials } from '../../context/StudentProvider';

interface StudentListItemProps {
  student: UIStudent;
  onEdit: (student: UIStudent) => void;
  onDelete: (student: UIStudent) => void;
  onView: (student: UIStudent) => void;
  index: number;
}

export const StudentListItem: React.FC<StudentListItemProps> = ({ student, onEdit, onDelete, onView, index }: StudentListItemProps) => {
  const initials = getInitials(student.name);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      onClick={() => onView(student)}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 flex items-center gap-4 cursor-pointer"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-emerald-500 to-emerald-600">
          {initials}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 bg-green-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{student.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{student.email}</p>
      </div>

      {/* Badges */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-full">
          {student.group}
        </span>
        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
          ANUL {student.year}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(student); }}
          className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-blue-900/30 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200"
          title="Editează"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(student); }}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200"
          title="Șterge"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};
