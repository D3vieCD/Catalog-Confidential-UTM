/**
 * Mock Dashboard Data - Date simulate pentru dashboard
 */

export const mockDashboardData = {
  // Statistici principale
  stats: [
    {
      title: 'Total Studenți',
      value: 142,
      subtitle: null,
      change: '+12%',
      changeType: 'increase' as const,
      icon: 'users',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Note Adăugate',
      value: 38,
      subtitle: '+5 astăzi',
      change: '+15%',
      changeType: 'increase' as const,
      icon: 'book',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Medie Generală',
      value: 8.7,
      subtitle: null,
      change: '+0.3',
      changeType: 'increase' as const,
      icon: 'chart',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Absențe Luna',
      value: 24,
      subtitle: null,
      change: '-8%',
      changeType: 'decrease' as const,
      icon: 'warning',
      color: 'from-orange-500 to-orange-600',
    },
  ],

  // Activitate recentă
  recentActivities: [
    {
      id: '1',
      studentName: 'Popescu Maria',
      action: 'Notă adăugată: 9',
      details: 'Grupa 9-B • Matematică',
      time: 'acum 5 min',
      type: 'grade' as const,
    },
    {
      id: '2',
      studentName: 'Ionescu Alex',
      action: 'Absență nemotivată',
      details: 'Grupa 10-A • Fizică',
      time: 'acum 15 min',
      type: 'absence' as const,
    },
    {
      id: '3',
      studentName: 'Georgescu Ana',
      action: 'Notă adăugată: 8',
      details: 'Grupa 9-B • Chimie',
      time: 'acum 30 min',
      type: 'grade' as const,
    },
    {
      id: '4',
      studentName: 'Vasile Radu',
      action: 'Notă adăugată: 10',
      details: 'Grupa 11-C • Română',
      time: 'acum 1 oră',
      type: 'grade' as const,
    },
    {
      id: '5',
      studentName: 'Stan Maria',
      action: 'Notă adăugată: 7',
      details: 'Grupa 10-A • Biologie',
      time: 'acum 2 ore',
      type: 'grade' as const,
    },
  ],

  // Orele de astăzi
  todaySchedule: [
    {
      id: '1',
      subject: 'Matematică',
      group: '9-B',
      time: '10:00 - 10:50',
      room: 'Sala 205',
      students: 28,
      status: 'completed' as const,
    },
    {
      id: '2',
      subject: 'Fizică',
      group: '10-A',
      time: '11:00 - 11:50',
      room: 'Sala 112',
      students: 25,
      status: 'current' as const,
    },
    {
      id: '3',
      subject: 'Chimie',
      group: '9-A',
      time: '12:00 - 12:50',
      room: 'Lab 301',
      students: 22,
      status: 'upcoming' as const,
    },
    {
      id: '4',
      subject: 'Română',
      group: '11-C',
      time: '13:00 - 13:50',
      room: 'Sala 208',
      students: 26,
      status: 'upcoming' as const,
    },
    {
      id: '5',
      subject: 'Istorie',
      group: '10-B',
      time: '14:00 - 14:50',
      room: 'Sala 103',
      students: 24,
      status: 'upcoming' as const,
    },
  ],

  // Date utilizator
  user: {
    name: 'Prof. Ionescu Dan',
    role: 'Administrator',
    initials: 'ID',
    avatar: null,
  },

  // Notificări
  notifications: [
    {
      id: '1',
      title: 'Notificare nouă',
      message: 'Popescu Maria a depus o temă nouă',
      time: 'acum 10 min',
      read: false,
    },
    {
      id: '2',
      title: 'Reminder oră',
      message: 'Ora de Fizică începe în 15 minute',
      time: 'acum 45 min',
      read: true,
    },
    {
      id: '3',
      title: 'Sistem actualizat',
      message: 'Catalogul a fost actualizat cu noi funcționalități',
      time: 'acum 2 ore',
      read: true,
    },
  ],
};

// Export individual sections for easier imports
export const { stats, recentActivities, todaySchedule, user, notifications } = mockDashboardData;
