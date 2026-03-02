import { motion } from 'framer-motion';

export const RecentActivity = () => {
  return (
    <motion.div>
      <h2>Activitate Recentă</h2>
    </motion.div>
  );
};
interface ActivityItem {
  id: string;
  studentName: string;
  action: string;
  details: string;
  time: string;
  type: 'grade' | 'absence' | 'other';
}