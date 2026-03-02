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

  const schedule: ScheduleItem[] = [
    {
      id: '1',
      subject: 'Matematică',
      group: '9-B',
      time: '10:00 - 10:50',
      room: 'Sala 205',
      students: 28,
      status: 'completed',
    },
    {
      id: '2',
      subject: 'Fizică',
      group: '10-A',
      time: '11:00 - 11:50',
      room: 'Sala 112',
      students: 25,
      status: 'current',
    },
    {
      id: '3',
      subject: 'Chimie',
      group: '9-A',
      time: '12:00 - 12:50',
      room: 'Lab 301',
      students: 22,
      status: 'upcoming',
    },
    {
      id: '4',
      subject: 'Română',
      group: '11-C',
      time: '13:00 - 13:50',
      room: 'Sala 208',
      students: 26,
      status: 'upcoming',
    },
  ];

  return (
    <motion.div>
      <h2>Ore Astăzi</h2>
    </motion.div>
  );
};