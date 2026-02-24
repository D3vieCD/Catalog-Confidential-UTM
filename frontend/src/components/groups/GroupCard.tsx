import { motion } from 'framer-motion';
import type { Group } from '../../_mock/mockGroups';

interface GroupCardProps {
  group: Group;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  index: number;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onEdit, onDelete, index }) => {
  const capacityPercentage = (group.currentCapacity / group.maxCapacity) * 100;

  // Determină culoarea progress bar-ului bazat pe capacitate
  const getCapacityColor = () => {
    if (capacityPercentage >= 90) return 'bg-red-400';
    if (capacityPercentage >= 70) return 'bg-orange-400';
    return 'bg-emerald-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.6) }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 relative"
    >