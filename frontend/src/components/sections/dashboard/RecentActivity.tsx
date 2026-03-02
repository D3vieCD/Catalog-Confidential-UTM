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
const activities: ActivityItem[] = [
  {
    id: '1',
    studentName: 'Popescu Maria',
    action: 'Notă adăugată: 9',
    details: 'Grupa 9-B • Matematică',
    time: 'acum 5 min',
    type: 'grade',
  },
  {
    id: '2',
    studentName: 'Ionescu Alex',
    action: 'Absență nemotivată',
    details: 'Grupa 10-A • Fizică',
    time: 'acum 15 min',
    type: 'absence',
  },
];
const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'grade':
      return <div>✔</div>;
    case 'absence':
      return <div>⚠</div>;
    default:
      return <div>ℹ</div>;
  }
};