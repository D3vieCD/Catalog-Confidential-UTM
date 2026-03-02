import { motion } from 'framer-motion';

/**
 * TodaySchedule - Secțiunea cu orele de astăzi
 */

export const TodaySchedule = () => {
  return (
    <motion.div>
      <h2>Ore Astăzi</h2>
    </motion.div>
  );
};
import { motion } from 'framer-motion';

/**
 * TodaySchedule - Secțiunea cu orele de astăzi
 */

interface ScheduleItem {
  id: string;
  subject: string;
  group: string;
  time: string;
  room: string;
  students: number;
  status: 'upcoming' | 'current' | 'completed';
}

export const TodaySchedule = () => {
  return (
    <motion.div>
      <h2>Ore Astăzi</h2>
    </motion.div>
  );
};