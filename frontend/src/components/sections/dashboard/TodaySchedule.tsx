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

  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'current':
        return 'În curs';
      case 'completed':
        return 'Finalizat';
      case 'upcoming':
        return 'Urmează';
      default:
        return '';
    }
  };

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

  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
      case 'upcoming':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusText = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'current':
        return 'În curs';
      case 'completed':
        return 'Finalizat';
      case 'upcoming':
        return 'Urmează';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Ore Astăzi
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
    </motion.div>
  );
};