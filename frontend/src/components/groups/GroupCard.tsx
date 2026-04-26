import { motion } from 'framer-motion';
import { Pencil, Trash2, Users2, GraduationCap, BookOpen, User } from 'lucide-react';
import type { Group } from '../../context/GroupProvider';

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  onView: (group: Group) => void;
  index: number;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onEdit, onDelete, onView, index }) => {
  const capacityPercentage = Math.min((group.currentCapacity / group.maxCapacity) * 100, 100);

  const capacityColor =
    capacityPercentage >= 90 ? 'bg-red-400' :
    capacityPercentage >= 70 ? 'bg-orange-400' : 'bg-emerald-400';

  const capacityText =
    capacityPercentage >= 90 ? 'text-red-500' :
    capacityPercentage >= 70 ? 'text-orange-500' : 'text-emerald-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.6) }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
      onClick={() => onView(group)}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-700 transition-all duration-300 relative cursor-pointer overflow-hidden"
    >
      {/* Colored top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

      <div className="p-5">
        {/* Header row: icon + name + actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm flex-shrink-0">
              <Users2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                {group.groupName}
              </h3>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold rounded-full">
                ANUL {group.year} · SEM {group.semester}
              </span>
            </div>
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(group); }}
              className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
              title="Editează"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(group); }}
              className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
              title="Șterge"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="truncate font-medium">{group.faculty || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <BookOpen className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="truncate">{group.specialization || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <User className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span className="truncate">{group.coordinator || '—'}</span>
          </div>
        </div>

        {/* Capacity */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 dark:text-gray-500 font-medium">Capacitate</span>
            <span className={`font-bold ${capacityText}`}>
              {group.currentCapacity}/{group.maxCapacity}
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${capacityColor} rounded-full transition-all duration-500`}
              style={{ width: `${capacityPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
